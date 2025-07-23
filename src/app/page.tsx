"use client";

// import NavBar from "@/app/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="bg-white">
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
      {/* Halaman Utama */}
      <div className="flex min-h-screen items-center justify-center overflow-x-hidden">
        <div className="hero relative min-h-screen w-[390px] bg-[#1D3023] md:w-full md:max-w-[720px]">
          <div className="navbar absolute top-0 right-0 left-0 z-30 justify-between text-[#E9DAB5]">
            <div className="flex-none">
              {/* Button Sidebar */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="btn btn-circle btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex-none">
              {/* Button Cart */}
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />{" "}
                  </svg>
                  <span className="badge badge-sm indicator-item hidden">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Background Untuk Mobile Device */}
          <div className="pointer-events-none absolute inset-0 md:hidden">
            <Image
              src="/homepage/Top_Oval_Mobile.png"
              alt="Oval Homepage"
              width="390"
              height="800"
              className="absolute top-0 left-1/2 z-0 -translate-x-1/2"
            />
            <Image
              src="/homepage/Middle_Milk_Mobile.png"
              alt="Milk Homepage"
              width="390"
              height="800"
              className="absolute top-1/12 left-1/2 z-20 -translate-x-1/2"
            />
            <Image
              src="/homepage/Bottom_Wood_Mobile.png"
              alt="Wood Homepage"
              width="390"
              height="800"
              className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2"
            />
          </div>
          {/* Background untuk PC Device */}
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <Image
              src="/homepage/Top_Oval_PC.png"
              alt="Oval Homepage"
              width="720"
              height="100"
              className="absolute top-0 left-1/2 z-0 -translate-x-1/2"
            />
            <Image
              src="/homepage/Middle_Milk_PC.png"
              alt="Milk Homepage"
              width="720"
              height="100"
              className="absolute top-0 left-1/2 z-20 -translate-x-1/2"
            />
            <Image
              src="/homepage/Bottom_Wood_PC.png"
              alt="Wood Homepage"
              width="720"
              height="100"
              className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2"
            />
          </div>
          {/* Button Order Menu */}
          <div className="hero-content text-neutral-content z-50 text-center">
            <div className="max-w-md">
              <Link
                href="/order-menu"
                className="btn relative z-100 mb-25 h-[30px] w-[140px] cursor-pointer border-none bg-[#271913] tracking-widest text-[#E7BB7D] hover:bg-[#3a2419] md:hidden"
              >
                ORDER HERE!
              </Link>
              <Link
                href="/order-menu"
                className="btn relative z-100 mb-4 hidden h-[40px] w-[160px] cursor-pointer border-none bg-[#271913] tracking-widest text-[#E7BB7D] hover:bg-[#3A2419] md:inline-flex"
              >
                ORDER HERE!
              </Link>
            </div>
          </div>
          <div className="hero-overlay bg-opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
