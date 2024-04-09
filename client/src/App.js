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
import Interview from './components/Interview/Interview';
import InstrucPage from './components/InstrucPage/InstrucPage';
import UserDetails from './components/UserDetails/UserDetails';

function App() {
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
          <Route path="/instructions" element={<InstrucPage/>} />
          <Route path="/user" element={<UserDetails/>} />
        </Routes>
        </SnackbarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
