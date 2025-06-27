import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState({
    doctors: false,
    profile: false
  });

  const handleError = (error) => {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    console.error(error);
  };

  const getDoctorsData = useCallback(async () => {
    try {
      setLoading(prev => ({...prev, doctors: true}));
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(prev => ({...prev, doctors: false}));
    }
  }, [backendUrl]);

  const loadUserProfileData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(prev => ({...prev, profile: true}));
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(prev => ({...prev, profile: false}));
    }
  }, [token, backendUrl]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    loading
  };

  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
      localStorage.removeItem("token");
    }
  }, [token, loadUserProfileData]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;