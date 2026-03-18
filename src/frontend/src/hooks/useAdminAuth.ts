import { useState } from "react";

const STORAGE_KEY = "angotur_admin_session";
const ADMIN_USER = "rafael";
const ADMIN_PASS = "2187";

export function useAdminAuth() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const adminLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAdminLoggedIn(false);
  };

  return { isAdminLoggedIn, adminLogin, adminLogout };
}
