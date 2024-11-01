import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice"; // Add this import
// import { useState, useEffect } from "react";

export default function Navbar() {
  const { user } = useSelector(selectAuth); // Add this line
  console.log(user);
  return (
    <>
      <div className="w-full h-16 bg-white flex justify-between items-center px-10 fixed top-0 z-10">
        <div className="flex items-center font-bold text-xl">
          <span className="text-green-500">Green</span>
          <span className="text-blue-800">Source</span>
        </div>
        <div className="flex items-center gap-8">
          <NavLink to="/" className="hover:text-blue-500 text-xl">
            Home
          </NavLink>
          <NavLink to={user ? "/profile" : "/login"}>
            {user ? (
              <span>{user.name}</span>
            ) : (
              <span>
                Login <ArrowRight className="" />
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
}
