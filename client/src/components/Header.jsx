import React from "react";
export default function Header() {
    return (
      <header className="bg-white pt-4 pb-2">
        <div className="mx-auto w-full px-4">
          <div className="flex justify-center">
            <div className="w-full bg-gray-300 py-2 rounded-lg">
              <h1 className="text-black text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em] text-center">
                KEJA
              </h1>
            </div>
          </div>
        </div>
      </header>
    );
  }