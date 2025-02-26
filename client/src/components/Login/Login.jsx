/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signup, signin } from '../../actions/auth';
import { createProfile } from '../../actions/profile';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import styles from './Login.module.css';
import myImage from './login_img.jpg';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', profilePicture: '', bio: '' };

const Login = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedRole = searchParams.get('role');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // "success", "error", "warning", "info"

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, role: selectedRole, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {
      dispatch(signup(formData, (msg) => showSnackbar(msg, 'success'), setLoading));
    } else {
      dispatch(signin(formData, (msg) => showSnackbar(msg, 'success'), setLoading));
    }
  };

  const switchMode = () => {
    setIsSignup((prevState) => !prevState);
  };

  const googleSuccess = async (res) => {
    const result = jwtDecode(res.credential);
    const token = res?.credential;

    dispatch(createProfile({
      name: result?.name,
      email: result?.email,
      userId: result?.jti,
      phoneNumber: '',
      businessName: '',
      contactAddress: '',
      logo: result?.picture,
      website: ''
    }));

    try {
      dispatch({ type: "AUTH", data: { result, token } });
      window.location.href = '/homepage';
    } catch (error) {
      showSnackbar("Google sign-in failed. Try again later.", 'error');
    }
  };

  const googleError = (error) => {
    console.error(error);
    showSnackbar("Google Sign In was unsuccessful. Try again later.", 'error');
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_content}>

        <div className={styles.auth_image}>
          <img src={myImage} alt="Image" />
        </div>

        <div className={styles.auth_form_container}>
          <h1 className={styles.heading}>{isSignup ? 'Sign up' : 'Sign in'}</h1>

          <form onSubmit={handleSubmit} className={styles.auth_form}>
            {isSignup && (
              <div className={styles.input_container}>
                <div className={styles.half_width}>
                  <input name="firstName" placeholder="First Name" onChange={handleChange} autoFocus className={styles.input_feild} />
                </div>
                <div className={styles.half_width}>
                  <input name="lastName" placeholder="Last Name" onChange={handleChange} className={styles.input_feild} />
                </div>
              </div>
            )}

            <input name="email" placeholder="Email Address" onChange={handleChange} type="email" className={styles.input_feild} />

            <input name="password" placeholder="Password" onChange={handleChange} type={showPassword ? 'text' : 'password'} className={styles.input_feild} />

            {isSignup && (
              <input name="confirmPassword" placeholder="Repeat Password" onChange={handleChange} type="password" className={styles.input_feild} />
            )}

            <div>
              {loading ? <CircularProgress /> : <button className={styles.submit_button}>{isSignup ? 'Sign Up' : 'Sign In'}</button>}
            </div>

            <div className={styles.auth_option}>
              <span>or</span>
            </div>

            <div>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess={googleSuccess} onError={googleError} text='continue_with' useOneTap auto_select state_cookie_domain='single_host_origin' />
              </GoogleOAuthProvider>
            </div>
          </form>

          <div className={styles.auth_switch}>
            <a onClick={switchMode}>{isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up"}</a>
          </div>

          <Link to="forgot">
            <p className={styles.forgot_password}>Forgotten Password?</p>
          </Link>
        </div>
      </div>

      {/*  MUI Snackbar Component */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Login;
