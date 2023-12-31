"use client"
import { DataTable } from "@/components/ui/data-table"
import { NewFareCapsDialog } from "./_components/new-fare-caps-dialog"
import { EditFareCapsDialog } from "./_components/edit-fare-caps-dialog"
import { useFareCapsApi } from "@/lib/api/rest"

const columns = [
  { header: "From", accessorKey: "from" },
  { header: "To", accessorKey: "to" },
  { header: "Daily Cap", accessorKey: "dailyCap" },
  { header: "Weekly Cap", accessorKey: "weeklyCap" },
]

export default function FareCapsPage() {
  const fareCaps = useFareCapsApi()

  return (
    <div className="mt-4 p-4 mx-auto max-w-screen-lg">
      <div className="pb-2 flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Fare Caps</h2>
        </div>
        <NewFareCapsDialog create={fareCaps.create} />
      </div>
      <div>
        <DataTable
          columns={columns}
          isLoading={fareCaps.isLoading}
          data={fareCaps.data ?? []}
          delete={fareCaps.delete}
          editDialog={({ id, initialValues, onDone }) => (
            <EditFareCapsDialog
              id={id}
              initialValues={initialValues}
              update={fareCaps.update}
              onDone={onDone}
            />
          )}
        />
      </div>
    </div>
  )
}
