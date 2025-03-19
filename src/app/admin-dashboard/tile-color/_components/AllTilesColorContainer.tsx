"use client"

import { useState } from "react"
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import TilePagination from "@/components/ui/TilePagination"
import { AllTilesColorData, type AllTilesColorDataType } from "./AllTilesColorData"
import { createAllTilesColorColumn } from "./AllTilesColorColumn"

interface TableContainerProps {
  data: AllTilesColorDataType[]
  columns: ColumnDef<AllTilesColorDataType>[]
}

const TableContainer = ({ data, columns }: TableContainerProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <DataTable table={table} columns={columns} />
    </>
  )
}

interface AllTilesColorsCotainerProps {
  onEdit: (color: AllTilesColorDataType) => void
}

const AllTilesColorsCotainer = ({ onEdit }: AllTilesColorsCotainerProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const columns = createAllTilesColorColumn({ onEdit })

  return (
    <section className="w-full">
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto rounded-[24px] bg-white">
        <TableContainer data={AllTilesColorData} columns={columns} />
      </div>
      <div className="mt-[30px] w-full pb-[208px] flex justify-between">
        <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">Showing 1 to 25 in first entries</p>
        <div>
          <TilePagination currentPage={currentPage} totalPages={10} onPageChange={(page) => setCurrentPage(page)} />
        </div>
      </div>
    </section>
  )
}

export default AllTilesColorsCotainer

