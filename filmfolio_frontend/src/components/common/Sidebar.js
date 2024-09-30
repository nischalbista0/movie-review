import axios from "axios";
import { React, useContext, useEffect, useState } from "react";
import {
  BiBookmark,
  BiCameraMovie,
  BiSearchAlt,
  BiSolidDashboard,
} from "react-icons/bi";

import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/filmcratebg.png";
import { UserContext } from "../../context/UserContext";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [userProfile, setUserProfile] = useState({});
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:3001/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const pathToTab = {
      "/dashboard": "dashboard",
      "/movies": "movies",
      "/search": "search",
      "/watchlist": "watchlist",
      "/profile": "profile",
    };

    setActiveTab(pathToTab[location.pathname] || "");
  }, [location.pathname]);

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        className="fixed bg-gray-700 text-white rounded-full z-10 top-3 left-2 p-2"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="https://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
        >
          <path
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 17h8m-8-5h14m-8-5h8"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-20 inset-y-0 left-0 w-64 bg-[#F6F7D3] overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button className="absolute top-5 right-0 p-2" onClick={toggleSidebar}>
          <svg
            xmlns="https://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
          >
            <path
              fill="#305973"
              stroke="#305973"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 17h8m-8-5h14m-8-5h8"
            />
          </svg>
        </button>

        <div className="absolute w-[9.8rem] top-7 left-2">
          {/* <img src={Logo} alt="" /> */}
          <h1 className="text-3xl font-bold font-serif">FilmCrate</h1>
        </div>

        {/* Sidebar Content */}
        <nav className="mt-20 relative top-6 sidefonts text-lg">
          <ul className="px-3 flex flex-col gap-2">
            {user?.user[0].userType === "admin" && (
              <li
                className={`cursor-pointer w-full flex gap-4 justify-start items-center px-4 py-3 text-[#305973] transition duration-400 hover:bg-[#305973] hover:text-white rounded-xl ${
                  activeTab === "dashboard" ? "bg-[#305973] text-white" : ""
                }`}
                onClick={() => navigate("/dashboard")}
              >
                <BiSolidDashboard className="w-8 h-8" />
                <p>Dashboard</p>
              </li>
            )}

            <li
              className={`cursor-pointer w-full flex gap-4 justify-start items-center px-4 py-3 text-[#305973] transition duration-400 hover:bg-[#305973] hover:text-white rounded-xl ${
                activeTab === "movies" ? "bg-[#305973] text-white" : ""
              }`}
              onClick={() => navigate("/movies")}
            >
              <BiCameraMovie className="w-8 h-8" />
              <p>Movies</p>
            </li>

            <li
              className={`cursor-pointer w-full flex gap-4 justify-start items-center px-4 py-3 text-[#305973] transition duration-400 hover:bg-[#305973] hover:text-white rounded-xl ${
                activeTab === "search" ? "bg-[#305973] text-white" : ""
              }`}
              onClick={() => navigate("/search")}
            >
              <BiSearchAlt className="w-8 h-8" />
              <p>Search</p>
            </li>

            {user?.user[0].userType !== "admin" && (
              <li
                className={`cursor-pointer w-full flex gap-4 justify-start items-center px-4 py-3 text-[#305973] transition duration-400 hover:bg-[#305973] hover:text-white rounded-xl ${
                  activeTab === "watchlist" ? "bg-[#305973] text-white" : ""
                }`}
                onClick={() => navigate("/watchlist")}
              >
                <BiBookmark className="w-8 h-8" />
                <p>Watchlist</p>
              </li>
            )}
          </ul>
        </nav>

        <div
          className="cursor-pointer absolute bottom-5 px-3 flex items-center gap-3 profilefonts text-[#305973]"
          onClick={() => {
            if (user) {
              navigate("/profile");
            }
          }}
        >
          <img
            src={
              userProfile?.user?.[0]?.image == null
                ? "https://img.freepik.com/free-icon/user_318-159711.jpg"
                : `http://localhost:3001/uploads/${userProfile?.user?.[0]?.image}`
            }
            alt=""
            className="w-[50px] h-[50px] rounded-full object-cover"
          />

          <div>
            {userProfile?.user && (
              <>
                <h1 className="font-semibold">
                  {userProfile?.user?.[0]?.username}
                </h1>
                <p className="text-sm truncate max-w-[160px]">
                  {userProfile?.user?.[0]?.email}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed z-10 inset-0 bg-black opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
