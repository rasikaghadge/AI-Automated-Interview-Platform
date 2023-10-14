import React, { useState } from 'react'
import Field from './Field'
import useStyles from './styles'
import styles from './Login.module.css'
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import {useDispatch} from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { signup, signin } from '../../actions/auth'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { createProfile } from '../../actions/profile'
import { useSnackbar } from 'react-simple-snackbar'
import CircularProgress from '@material-ui/core/CircularProgress';

import myImage from './login_img.jpg';

const initialState ={ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', profilePicture: '', bio: ''}

const Login = () => {

    const classes = useStyles();
    const [formData, setFormData] = useState(initialState)
    const [isSignup, setIsSignup] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
     // eslint-disable-next-line 
    const [openSnackbar, closeSnackbar] = useSnackbar()
    const user = JSON.parse(localStorage.getItem('profile'))
    const [loading, setLoading] = useState(false)
    
    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleChange =(e)=> {
        setFormData( {...formData, [e.target.name] : e.target.value} )
    }

    const handleSubmit =(e) => {
        e.preventDefault()
        if(isSignup) {
            dispatch(signup(formData, openSnackbar, setLoading))
        } else {
            dispatch(signin(formData, openSnackbar, setLoading))
        }
        setLoading(true)
    }


    const switchMode =() => {
        setIsSignup((prevState) => !prevState)
    }

    const googleSuccess = async (res) => {
        const result = jwtDecode(res.credential);
        const token = res?.credential;
        dispatch(createProfile({name: result?.name, email: result?.email, userId: result?.jti, phoneNumber: '', businessName: '', contactAddress: '', logo: result?.picture, website: ''}))

        try {
            dispatch({ type: "AUTH", data: {result, token}})

            window.location.href='/homepage'
            
        } catch (error) {
            console.log(error)
        }
    }
    const googleError =(error) => {
        console.log(error)
        console.log("Google Sign In was unsuccessful. Try again later")
    }


    if(user) {
      navigate('/homepage')
    }

      
return (
  <div className={styles.auth_container}>
    <div className={styles.auth_content}>

      <div className={styles.auth_image}>
        <img src={myImage} alt="Image" />
      </div>

      <div className={styles.auth_form_container} >
        <h1 className={styles.heading}>{isSignup ? 'Sign up' : 'Sign in'}</h1>

        <form onSubmit={handleSubmit} className={styles.auth_form}>
          {isSignup && (
            <>
              <div className={styles.input_container}>
                <div className={styles.half_width}>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleChange}
                    autoFocus
                    className={styles.input_feild}
                  />
                </div>

                <div className={styles.half_width}>
                  <input name="lastName" placeholder="Last Name" onChange={handleChange} className={styles.input_feild}/>
                </div>
              </div>
            </>
          )}

          <input name="email" placeholder="Email Address" onChange={handleChange} type="email" className={styles.input_feild}/>
          
          <input
            name="password"
            placeholder="Password"
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            className={styles.input_feild}
          />

          {isSignup && (
            <input
              name="confirmPassword"
              placeholder="Repeat Password"
              onChange={handleChange}
              type="password"
              className={styles.input_feild}
            />
          )}

          <div>
            <div>
              {loading ? <CircularProgress /> 
              : 
              <button className={styles.submit_button} >{ isSignup ? 'Sign Up' : 'Sign In' }</button>
              }
            </div>

            <div className={styles.auth_option}>
              <span>or</span>
            </div>

            <div> 
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onError={googleError}
                  text='continue_with'
                  useOneTap
                  auto_select
                  state_cookie_domain='single_host_origin'
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </form>

        <div className={styles.auth_switch}>
          <a onClick={switchMode}>
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up"}
          </a>
        </div>

        <Link to="forgot">
          <p className={styles.forgot_password}>Forgotten Password?</p>
        </Link>
      </div>
    </div>
  </div>
)
}

export default Login
