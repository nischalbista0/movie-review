import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiBookmarkAlt, BiMovie } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";

const Dashboard = () => {
  const [dashboardSummary, setDashboardSummary] = useState({
    totalUsers: 0,
    totalReview: 0,
    totalWatchlist: 0,
  });

  useEffect(() => {
    // Fetch dashboard summary data when the component mounts
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/admin/dashboard-summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDashboardSummary(response.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchDashboardSummary();
  }, []); // Empty dependency array to ensure it runs only once on mount

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/admin/dashboard-summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDashboardSummary(response.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchDashboardSummary();
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // You may want to refresh the user data after deletion
      fetchUsers();

      // reload page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-5 py-5 p-20">
        <h2 className="text-3xl font-bold text-purple-lighter">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Total Users */}
          <div className="bg-[#E0F7FA] shadow-xl rounded-lg flex items-center justify-between p-6 border-b-4 border-[#305973] text-[#305973] font-semibold group transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-transform duration-300 transform group-hover:rotate-12 shadow-md">
              <FaUserFriends className="w-6 h-6 text-[#305973]" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {dashboardSummary.totalUsers}
              </p>
              <p className="text-sm uppercase">Total Users</p>
            </div>
          </div>

          {/* Card 2: Total Reviews */}
          <div className="bg-[#F5F5F5] shadow-xl rounded-lg flex items-center justify-between p-6 border-b-4 border-[#305973] text-[#305973] font-semibold group transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-transform duration-300 transform group-hover:rotate-12 shadow-md">
              <BiMovie className="w-6 h-6 text-[#305973]" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {dashboardSummary.totalReview}
              </p>
              <p className="text-sm uppercase">Total Reviews</p>
            </div>
          </div>

          {/* Card 3: Total Movies Watchlisted */}
          <div className="bg-[#FFFDE7] shadow-xl rounded-lg flex items-center justify-between p-6 border-b-4 border-[#305973] text-[#305973] font-semibold group transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-transform duration-300 transform group-hover:rotate-12 shadow-md">
              <BiBookmarkAlt className="w-6 h-6 text-[#305973]" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {dashboardSummary.totalWatchlist}
              </p>
              <p className="text-sm uppercase">Total Movies Watchlisted</p>
            </div>
          </div>
        </div>

        {/* Display a table of users */}
        {users.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg border border-[#305973]">
              <thead className="bg-[#305973]">
                <tr>
                  <th className="px-6 py-3 text-white text-center uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-white text-center uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-white text-center uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-t border-[#305973] ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition duration-200`}
                  >
                    <td className="px-6 py-4 text-center text-[#305973]">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-center text-[#305973]">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="bg-[#305973] text-white px-4 py-2 rounded-md hover:bg-[#204356] transition duration-200"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
