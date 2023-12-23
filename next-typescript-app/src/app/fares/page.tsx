"use client"
import { DataTable } from "@/components/ui/data-table"
import { useRestApi } from "@/lib/api/rest-client"
import { NewFareDialog } from "./_components/new-fare-dialog"

const columns = [
  { header: "From", accessorKey: "from" },
  { header: "To", accessorKey: "to" },
  { header: "Peak Fare", accessorKey: "peakFare" },
  { header: "Off Peak Fare", accessorKey: "offPeakFare" },
]

export default function FaresPage() {
  const fares = useRestApi("/api/v1/fares")

  return (
    <div className="mt-4 p-4 mx-auto max-w-screen-lg">
      <div className="pb-2 flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Fares</h2>
        </div>
        <NewFareDialog create={fares.create} />
      </div>
      <div>
        <DataTable
          columns={columns}
          isLoading={fares.isLoading}
          data={fares.data ?? []}
          delete={fares.delete}
          editRoute={id => `/fares/${id}/edit`}
        />
      </div>
    </div>
  )
}
