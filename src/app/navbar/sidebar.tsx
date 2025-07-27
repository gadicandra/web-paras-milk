"use client"

import { useState } from "react";

export default function Sidebar(){
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return(
    <div>
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="btn btn-circle btn-ghost"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
        </button>
        {/* Sidebar */}
        <aside
        className={`rounded-tr-4xl fixed top-0 left-0 z-70 h-screen w-[232px] transform bg-[#1D3023] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
        >
        <div className="flex bg-[1D3023]">
            <div className="flex-col "></div>
            <div className="flex-col bg-[#FAF5E1]"></div>
        </div>
        </aside>
        {/* Backdrop */}
        {isSidebarOpen && (
        <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-60 bg-black/50"
        ></div>
        )}
    </div>)

}