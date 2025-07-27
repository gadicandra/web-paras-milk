import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Halaman Utama */}
      <div className="flex min-h-screen items-center justify-center overflow-x-hidden">
        <div className="hero relative min-h-screen w-[390px] bg-[#1D3023] md:w-full md:max-w-[720px]">
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
