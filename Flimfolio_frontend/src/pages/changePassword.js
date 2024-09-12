import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/images/bg2.jpg";
import Logo from "../assets/images/filmcratebg.png";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.put(
        `http://localhost:3001/users/change-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccessMessage("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      navigate("/");
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMessage("");
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-[#F6F7D3]">
      <div className="bg-[#F6F7D3] hidden lg:block w-full md:w-1/2 xl:w-2/3">
        <img src={Bg} alt="background" className="w-full h-full object-cover" />
      </div>
      <div className="bg-[#F6F7D3] w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 px-6 lg:px-16 xl:px-12 flex items-center justify-center my-4">
        <div className="w-full h-100">
          <img src={Logo} alt="Logo" className="relative -left-4" />
          <h1 className="text-4xl md:text-4xl font-bold leading-tight mt-4 mb-3 text-[#305973] texts">
            Change Password
          </h1>
          <h2 className="text-3xl md:text-3xl font-medium leading-tight texts">
            CHANGE YOUR PASSWORD
          </h2>

          <form className="mt-4 bg-[#F6F7D3]" action="#" method="POST">
            <div>
              <label className="block text-[#305973] text-3xl texts">
                Current Password
              </label>
              <Input
                type="password"
                placeholder="Enter your current password"
                autoFocus
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#305973] text-3xl mt-3 texts">
                New Password
              </label>
              <Input
                type="password"
                placeholder="Enter your new password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <label className="block text-[#305973] text-3xl  mt-3 texts">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm your password"
                minLength="6"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-lg mt-3 moviefonts">{error}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-lg mt-3 moviefonts">
                {successMessage}
              </p>
            )}

            <Button text="CHANGE PASSWORD" onClick={handlePasswordChange} />
          </form>
        </div>
      </div>
    </section>
  );
}
