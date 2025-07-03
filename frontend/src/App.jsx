import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnboardingPage from './pages/OnboardingPage';

import useAuthUser from './hooks/useAuthUser';
import Layout from './components/Layout.jsx';
import PageLoader from './components/PageLoader.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const App = () => {
  const { isLoading, authUser, isError } = useAuthUser();
  const isAuthenticated = !isError && !!authUser;
  const isOnboarded = authUser?.isOnboarded;

  const navigate = useNavigate();
  const location = useLocation();


  if (isLoading) {
    return <div className="flex items-center justify-center">
      <PageLoader/>
    </div>;
  }

  const RequireOnboarding = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isOnboarded) return <Navigate to="/onboarding" replace />;
    return children;
  };

  return (
    <div className="h-screen" data-theme="dark">
      <Toaster />

      <Routes>
        <Route path="/" element={

          <RequireOnboarding>
            <Layout showSidebar>
              {
               isAuthenticated &&
              <HomePage />
        }
            </Layout>
          </RequireOnboarding>
        } />

        <Route path="/chat" element={
          <RequireOnboarding>
            <Layout>
              <ChatPage />
            </Layout>
          </RequireOnboarding>
        } />

        <Route path="/call" element={
          <RequireOnboarding>
            <Layout>
              <CallPage />
            </Layout>
          </RequireOnboarding>
        } />

         <Route path="/profile" element={
          <RequireOnboarding >
            <Layout showSidebar>
              <ProfilePage />
            </Layout>
          </RequireOnboarding>
        } />

        <Route path="/notification" element={
          <RequireOnboarding>
            <Layout showSidebar>
              <NotificationsPage />
            </Layout>
          </RequireOnboarding>
        } />

        <Route path="/friends" element={
          <RequireOnboarding>
            <Layout showSidebar>
              <FriendsPage />
            </Layout>
          </RequireOnboarding>
        } />


        <Route path="/onboarding" element={
          isAuthenticated
            ? isOnboarded
              ? <Navigate to="/" replace />
              : <OnboardingPage />
            : <Navigate to="/login" replace />
        } />

        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
