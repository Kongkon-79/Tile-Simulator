"use client"
import { Sidebarcontents } from "@/data/admin-dashboard-data";
import React from "react";
import DashboardSidebarItem from "./dashboard-sidebar-item";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

const DashboardSidebar = () => {
  return (
    <div className="w-[300px] max-w-[354px] h-screen bg-white shadow-[4px_0px_10px_0px_rgba(0,0,0,0.25)] pl-7 sticky top-0 z-50 -mt-[86px] flex flex-col">
      
        <div>
        <div className="pt-[30px]">
          <Link href="/">
            <Image
              src="/assets/lili_logo.png"
              alt="logo"
              width={184}
              height={82}
            />
          </Link>
        </div>
        <div className="mt-[70px]">
          {Sidebarcontents?.map((item) => (
            <DashboardSidebarItem key={item?.id} item={item} />
          ))}
        </div>
        </div>
        <div className="mt-auto pb-10">
            <Button variant="ghost" className="w-full flex items-center justify-start gap-4 text-lg font-medium text-black leading-[120%] shadow-none border-none mb-4"><Settings/> Setting</Button>
            <Button onClick={() => signOut({callbackUrl: "/"})} variant="ghost" className="w-full flex items-center justify-start gap-4 text-lg font-medium text-black leading-[120%] shadow-none border-none "><LogOut /> Log out</Button>
        </div>
    </div>
  );
};

export default DashboardSidebar;
