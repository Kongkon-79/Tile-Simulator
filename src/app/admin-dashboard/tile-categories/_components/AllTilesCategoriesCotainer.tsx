

"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

const AllTilesCategoriesCotainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <section className="w-full">
      <div>
        <div>
          <div>
            <h1>Tile Categories</h1>
            <div>
              <Link href="/admin-dashboard">Dashboard</Link>
              <Link href="/admin-dashboard/tile-categories">Tile Categories</Link>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto  rounded-[24px] bg-white">
        <TableContainer data={AllTilesCategoriesData} columns={AllTilesCategoriesColumn} />
      </div>
      <div className="mt-[30px]  w-full pb-[208px]  flex justify-between">
        <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
          Showing 1 to 25 in first entries
        </p>
        <div>
          <TilePagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </section>
  );
};

export default AllTilesCategoriesCotainer;
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import TilePagination from "@/components/ui/TilePagination";
import { AllTilesCategoriesData, AllTilesCategoriesDataType } from "./AllTilesCategoriesData";
import { AllTilesCategoriesColumn } from "./AllTilesCategoriesColumn";
import Link from "next/link";



const TableContainer = ({
  data,
  columns,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: ColumnDef<AllTilesCategoriesDataType>[];
}) => {
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <DataTable table={table} columns={columns} />
    </>
  );
};
