import type { DayOfWeek, PrismaClient } from "@prisma/client"
import type { ITXClientDenyList } from "@prisma/client/runtime/library"
import type { PeakHours } from "@/lib/server/db/peak-hours"
import { prisma } from "@/lib/server/db/client"

type Txn = Omit<PrismaClient, ITXClientDenyList>

export async function clearDb(txn: Txn) {
  await txn.trip.deleteMany()
  await txn.customer.deleteMany()
  await txn.fare.deleteMany()
  await txn.fareCap.deleteMany()
  await txn.peakHour.deleteMany()
}

const FARES = [["red", "green", 4.5, 3]] as [string, string, number, number][]

async function createFares(txn: Txn) {
  await txn.fare.createMany({
    data: FARES.map(([from, to, peakFare, offPeakFare]) => ({
      from,
      to,
      peakFare,
      offPeakFare,
    })),
  })
}

const FARES_CAPS = [["red", "green", 12, 30]] as [
  string,
  string,
  number,
  number,
][]

async function createFareCaps(txn: Txn) {
  await txn.fareCap.createMany({
    data: FARES_CAPS.map(([from, to, dailyCap, weeklyCap]) => ({
      from,
      to,
      dailyCap,
      weeklyCap,
    })),
  })
}

const PEAK_HOURS: PeakHours = {
  weekday: [{ start: "0600", end: "0900" }],
  saturday: [{ start: "0900", end: "1200" }],
  sunday: [
    { start: "1000", end: "1200" },
    { start: "1800", end: "2000" },
  ],
}

async function createPeakHours(txn: Txn) {
  const data = Object.entries(PEAK_HOURS).flatMap(([day, times]) =>
    times.map(t => ({ ...t, day: day as DayOfWeek })),
  )
  await txn.peakHour.createMany({ data })
}

const CUSTOMERS = [
  [1, "John"],
  [2, "Jane"],
  [3, "Jack"],
] as [number, string][]

async function createCustomers(txn: Txn) {
  await txn.customer.createMany({
    data: CUSTOMERS.map(([id, name]) => ({ name })),
  })
}

// id?: bigint | number
// date: Date | string
// customerId: bigint | number
// from: string
// to: string
const TRIPS = [] as [string, number, string, string][]

async function createTrips(txn: Txn) {
  await txn.trip.createMany({
    data: TRIPS.map(([date, customerId, from, to]) => ({
      date: new Date(date).toISOString(),
      customerId,
      from,
      to,
    })),
  })
}

const CUSTOMER_TRIPS = [
  {
    name: "John",
    trips: [
      ["2023-09-12", "green", "red"],
      ["2023-09-13", "green", "yellow"],
    ],
  },
  {
    name: "Jane",
    trips: [
      ["2023-09-15", "green", "red"],
      ["2023-09-16", "green", "yellow"],
    ],
  },
]

async function createCustomerTrips(txn: Txn) {
  await Promise.all(
    CUSTOMER_TRIPS.map(c => {
      return txn.customer.create({
        data: {
          name: c.name,
          trips: {
            createMany: {
              data: c.trips.map(([date, from, to]) => ({
                date: new Date(date).toISOString(),
                from,
                to,
              })),
            },
          },
        },
      })
    }),
  )
}

export async function seedDb() {
  await prisma.$transaction(async txn => {
    await clearDb(txn)
    await createFares(txn)
    await createFareCaps(txn)
    await createPeakHours(txn)
    await createCustomerTrips(txn)
  })
}
