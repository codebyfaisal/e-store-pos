import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, useApiDataStore } from "@/store/index.js";
import { Loader } from "@/components/index.js";
import api from "@/services/api";

const PrivateRoute = () => {
  const {
    isAuthenticated,
    setPermissions,
    setUser,
    setNotifications,
    _clearAuth,
    login,
  } = useAuthStore();
  const { fetchData } = useApiDataStore();
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    setLoading(true);
    try {
      const result = await api.get("/api/users/profile/bootstrap");

      const userData = result?.data?.result?.[0];
      if (!userData) {
        _clearAuth();
        return;
      }

      login();
      setUser(userData.user);
      setPermissions([...userData.permissions,""]);
      setNotifications([...userData.notifications]);
    } catch (error) {
      _clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  if (loading) return <Loader message="Loading ..." />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
