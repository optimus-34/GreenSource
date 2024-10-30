import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="w-full h-16 bg-white flex justify-around items-center px-10 fixed top-0 z-10">
        <div className="flex items-center font-bold text-xl">
          <span className="text-green-500">Green</span>
          <span className="text-blue-800">Source</span>
        </div>
        <div className="flex items-center gap-8">
          <NavLink to="/" className="hover:text-blue-500 text-xl">
            Home
          </NavLink>
          <NavLink
            to="/login"
            className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <span>Login</span>
            <ArrowRight className="size-5" />
          </NavLink>
        </div>
      </div>
    </>
  );
}
