import { UploadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineChangeCircle } from "react-icons/md";
import { PiUserSwitchDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export const ProfileBody = () => {
  const [userProfile, setUserProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const { user } = useContext(UserContext);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const updatedProfile = {
        username: name,
        email: email,
      };

      const response = await axios.put(
        "http://localhost:3001/users/edit-profile",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccessMessage("Profile updated successfully!");
      setError("");
      fetchUserProfile();
      setEditing(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while updating the profile.");
      }
    }
  };
  const fetchUserProfile = () => {
    axios
      .get("http://localhost:3001/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserProfile(response.data);

        // Populate the initial values from the API response
        setName(response.data?.user?.[0]?.username || "");
        setEmail(response.data?.user?.[0]?.email || "");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // Fetch user profile data when the component mounts
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Clear the user authentication token from local storage
    localStorage.removeItem("token");

    // Navigate the user to the login page
    window.location.href = "/login";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setSelectedFileName(file?.name || ""); // Set the filename when the image is selected
  };

  const handleUploadImage = async () => {
    try {
      if (!selectedImage) {
        alert("Please select an image to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", selectedImage);

      await axios.post("http://localhost:3001/users/uploadImage", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSelectedFileName(""); // Reset the filename display after image upload

      // Call the function to fetch updated profile data after saving
      fetchUserProfile();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileClick = () => {
    // Trigger click event of file input
    fileInputRef.current.click();
  };

  const handleCloseError = () => {
    setError("");
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-xl p-8 ">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative h-[120px] w-[120px]  rounded-[50%]">
              <img
                src={
                  userProfile?.user?.[0]?.image == null
                    ? "https://img.freepik.com/free-icon/user_318-159711.jpg"
                    : `http://localhost:3001/uploads/${userProfile?.user?.[0]?.image}`
                }
                alt="user-profile-image"
                className="h-[120px] w-[120px] rounded-[50%] object-cover"
              />

              {!selectedFileName && (
                <button
                  className="
                bg-[#305973] rounded-full h-10 w-10 flex items-center justify-center absolute bottom-0 right-0"
                  onClick={handleFileClick}
                >
                  <UploadIcon className="h-6 w-6 text-white" />
                  {/* Hide the file input element */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </button>
              )}
            </div>

            <div className="flex flex-col texts items-center justify-center sm:items-start sm:justify-items-start">
              {editing ? (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-4xl texts focus:outline-none"
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-2xl texts text-gray-500 focus:outline-none"
                  />
                </>
              ) : (
                <>
                  <div className="relative flex flex-col items-end">
                    {user?.user[0].userType === "admin" && (
                      <p className="text-3xl rotate-[15deg] absolute -right-5 -top-4">
                        ♛
                      </p>
                    )}
                    <p className="text-4xl texts flex items-center">
                      {userProfile?.user?.[0]?.username} {}
                    </p>
                  </div>

                  <p className="text-2xl texts text-gray-500">
                    {userProfile?.user?.[0]?.email}
                  </p>
                </>
              )}
            </div>
          </div>

          {selectedFileName && (
            <div
              className="bg-[#305973] w-fit self-center text-white px-4 py-2 rounded-md flex items-center justify-center cursor-pointer gap-1"
              onClick={handleUploadImage}
            >
              <UploadIcon className="h-5 w-5" />
              <p>Upload {selectedFileName}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row px-10 py-3 moviefonts font-semibold items-center gap-8 text-sm cursor-pointer">
            <Link to="/changePassword">
              <div className="flex items-center gap-1">
                <MdOutlineChangeCircle className="h-5 w-5" />
                <p>Change Password</p>
              </div>
            </Link>
            <div
              className="flex items-center gap-1"
              onClick={editing ? handleSaveClick : handleEditClick}
            >
              <PiUserSwitchDuotone className="h-5 w-5" />
              <p>{editing ? "Save" : "Edit Profile"}</p>
            </div>
            <div className="flex items-center gap-1" onClick={handleLogout}>
              <IoMdLogOut className="h-5 w-5" />
              <p>Logout</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
              <button
                className="absolute top-0 right-0 p-1"
                onClick={handleCloseError}
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.293-8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414L11.414 13l3.293 3.293a1 1 0 01-1.414 1.414L10 14.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 13 5.293 9.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {successMessage}
              <button
                className="absolute top-0 right-0 p-1"
                onClick={handleCloseSuccessMessage}
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.293-8.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414L11.414 13l3.293 3.293a1 1 0 01-1.414 1.414L10 14.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 13 5.293 9.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
