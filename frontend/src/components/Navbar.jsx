import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="w-full bg-[#1f1740] px-8 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-white hover:text-[#a678ff] transition duration-300 text-2xl font-bold no-underline hover:no-underline">MyTurn</Link>
      <div className="flex gap-6">
        <Link to="/info" className="text-white hover:text-[#a678ff] transition duration-300 font-medium no-underline hover:no-underline">Info</Link>
        <Link to="/overview" className="text-white hover:text-[#a678ff] transition duration-300 font-medium no-underline hover:no-underline">Overview</Link>
        <Link to="/Result" className="text-white hover:text-[#a678ff] transition duration-300 font-medium no-underline hover:no-underline">Results</Link>
      </div>
    </nav>
  );
}
