import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SnackbarProvider from 'react-simple-snackbar'
import Home from './components/Home/Home';
import Profile from './components/UpdateProfile/UpdateProfile';
import Login from './components/Login/Login'
import Forgot from './components/Password/Forgot'
import Reset from './components/Password/Reset'
import Homepage from './components/Homepage/Homepage';
import RoleSelect from './components/RoleSelect/RoleSelect';
import Schedule from './components/Schedule/Schedule';
import SeeScheduledInterviews from './components/SeeScheduledInterviews/SeeScheduledInterviews';
import Interview from './components/Interview/Interview'
import UserDetails from './components/UserDetails/UserDetails';
import { refresh } from './actions/auth';

function App() {

  const user = JSON.parse(localStorage.getItem("profile"));
  console.log(user)
  useEffect(() => {
    const refreshToken = () => {
      try {
        const response = refresh({ token: user?.refreshToken });
        if (!response.status === 200) {
          console.log('Error ', response)
        }
        const newToken = response.data.token;
        localStorage.setItem("profile", JSON.stringify({ ...user, token: newToken }));
      } catch (error) {
        console.log(error)
      }
    };

    if (user) {
      const refreshInterval = setInterval(() => {
        refreshToken();
      }, 60000); // Refresh every 1 minute

      return () => clearInterval(refreshInterval); // Clean up the interval on component unmount
    }
  }, []);
  return (
    <div>
      <BrowserRouter>
      <SnackbarProvider>
        <Routes>
          <Route path="/interview" element={<Interview/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/homepage" element={<Homepage/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/scheduledinterviews" element={<SeeScheduledInterviews/>} />
          <Route path="/forgot" element={<Forgot/>} />
          <Route path="/reset/:token" element={<Reset/>} />
          <Route path="/select" element={<RoleSelect/>} />
          <Route path="/schedule" element={<Schedule/>} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/user" element={<UserDetails/>} />
        </Routes>
        </SnackbarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
