import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const res = await axios.get("/protected/");
      if (res.data.authenticated) {
        setUser(res.data.user);
        console.log("Authenticated:", res.data.user);
      } else {
        console.log("User is not authenticated");
      }
    } catch (err) {
    //   console.error("Error during authentication check:", err);
      if (err.response?.status === 401) {
        try {
          const res1 = await axios.post("/refresh/");
          console.log(res1.status);
          if (res1.status === 200) {
            const user = await axios.get("/protected/");
            setUser(user.data.user);
            console.log("Authenticated user after refresh:", user.data.user);
            navigate("/dashboard");
          }
        } catch (refreshErr) {
        //   console.error("Error during token refresh:", refreshErr); 
          setUser(null); 
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (username, password) => {
    try {
      const res = await axios.post("/login/", { username, password });
      console.log("Login response: ", res);
      await checkAuth();
      console.log("Logged in user:", username);
      navigate("/dashboard");
    } catch (err) {
    //   console.error("Login failed:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  // Logout
  const logout = async () => {
    await axios.post("/logout/");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
