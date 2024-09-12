import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      if (token) {
        // If token exists, fetch the user data
        const response = await axios.get("http://localhost:3001/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setUser(response.data);
      } else {
        // If token doesn't exist, set user state to null
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      setUser(null); // Set user state to null in case of an error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};
