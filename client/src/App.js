
//Copyright (c) 2022 Panshak Solomon

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SnackbarProvider from 'react-simple-snackbar'
import Home from './components/Home/Home';
import Login from './components/Login/Login'
import Forgot from './components/Password/Forgot'
import Reset from './components/Password/Reset'
import Homepage from './components/Homepage/Homepage';

function App() {

  const user = JSON.parse(localStorage.getItem('profile'))

  return (
    <div>
      <BrowserRouter>
      <SnackbarProvider>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/homepage" element={<Homepage/>} />
          <Route path="/forgot" element={<Forgot/>} />
          <Route path="/reset/:token" element={<Reset/>} />
        </Routes>
        </SnackbarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
