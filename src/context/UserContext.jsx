import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user
    ? JSON.parse(user)
    : {
        id: null,
        firstName: "",
        lastName: "",
        usertype: "",
        contact: "",
        cnic: "",
        email: "",
        password: "",
        province: null,
        division: null,
        district: null,
        tehsil: null,
        hospital: null,
        createdOn: null,
      };
};

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromLocalStorage);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const updateUser = (newUser) => {
    setUser((prevUser) => ({ ...prevUser, ...newUser }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
