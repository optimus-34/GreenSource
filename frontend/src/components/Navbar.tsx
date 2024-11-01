import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice"; // Add this import
// import { useState, useEffect } from "react";

export default function Navbar() {
  const { user } = useSelector(selectAuth); // Add this line
  // const [isUserPresent, setIsUserPresent] = useState(false);
  // useEffect(() => {
  //   setIsUserPresent(!!user);
  // }, [user]);

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
          {user ? (
            <NavLink to="/profile">
              <span>{user.name}</span>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <span>Login</span> <ArrowRight className="size-5" />
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
}
