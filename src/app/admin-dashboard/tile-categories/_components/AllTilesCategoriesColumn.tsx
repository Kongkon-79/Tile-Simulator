"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { ColumnDef } from "@tanstack/react-table"
import ActionsButton from "./ActionsButton"
import { AllTilesCategory } from "./AllTilesCategoriesData"

interface ColumnProps {
  onEdit: (category: AllTilesCategory) => void
}

export const createAllTilesCategoriesColumn = ({ onEdit }: ColumnProps): ColumnDef< AllTilesCategory>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Categories Name",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.name}
          </span>
        </div>
      )
    },
  },
  {
    header: "Count",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.count}</span>
        </div>
      )
    },
  },
  // {
  //   header: "Date",
  //   cell: ({ row }) => {
  //     const dateString = row.original.updated_at;
  //     const date = new Date(dateString); // Parse the string into a Date object

  //     // Format the Date object
  //     const formattedDate = date.toLocaleString('en-US', {
  //       year: 'numeric', month: 'long', day: 'numeric',
  //       hour: '2-digit'
  //     });
  //     return (
  //       <div className="flex justify-center items-center gap-[2px]">
  //         <span className="text-base font-normal text-black leading-[120%] text-center">{formattedDate}</span>
  //       </div>
  //     )
  //   },
  // },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <ActionsButton row={row} onEdit={onEdit}/>
        </div>
      )
    },
  },
]

