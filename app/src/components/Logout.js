import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";

// Create standalone logout function
export const logoutUser = async (logoutFn, navigateFn) => {
  try {
    await fetch(`${process.env.REACT_APP_FLASK_URI}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    logoutFn();
    navigateFn("/");
  } catch (error) {
    // console.error("Logout failed:", error);
  }
};

// Hook for components
const UseLogout = () => {
  const { logout } = useContext(LoginContext);
  const navigate = useNavigate();

  return () => logoutUser(logout, navigate);
};

export default UseLogout;
