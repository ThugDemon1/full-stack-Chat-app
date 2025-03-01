import React, { useEffect, useInsertionEffect } from 'react';
import { Loader } from "lucide-react";
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './Page/HomePage.jsx';
import SignUpPage from './Page/SignUpPage.jsx';
import LoginPage from './Page/LoginPage.jsx';
import ProfilePage from './Page/ProfilePage.jsx';
import SettingPage from './Page/Setting.jsx';
import Navbar from './components/Navbar.jsx';
import { useAuthStore } from './store/authStore.js';
import {Toaster} from 'react-hot-toast';
import { useThemeStore } from './store/themeStore.js';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  
  return (
    <div data-theme= { theme }>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser? <HomePage />:<Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
        <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/"/>} />
        <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/login"/>} />
        <Route path="/setting" element={<SettingPage />} />
      </Routes>
      <Toaster></Toaster>
    </div>
  );
};

export default App;
