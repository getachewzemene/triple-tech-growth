"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const StudentHeader = () => {
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full z-50 bg-light-blue/95 backdrop-blur-md shadow-2xl border-b border-white/10">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 text-2xl font-bold transition-all duration-500 transform hover:scale-105 text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Triple Technologies Logo"
              width={40}
              height={40}
              className="transition-all duration-300 hover:rotate-12"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow/20 to-white/20 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            Triple Technologies
          </span>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
