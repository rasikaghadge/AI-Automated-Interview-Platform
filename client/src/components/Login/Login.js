import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { signin, signup } from "../../actions/auth";
import styles from "./Login.module.css";

import myImage from "./login_img.jpg";

import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  profilePicture: "",
  bio: "",
};

const Login = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedRole = searchParams.get("role");

  const [formData, setFormData] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [loading, setLoading] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: selectedRole,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signup(formData, openSnackbar, setLoading));
    } else {
      dispatch(signin(formData, openSnackbar, setLoading));
    }
    setLoading(true);
  };

  const switchMode = () => {
    setIsSignup((prevState) => !prevState);
  };

  useEffect(() => {
    if (user) {
      navigate("/homepage");
    }
  })

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_content}>
        <div className={styles.auth_image}>
          <img src={myImage} alt="Image" />
        </div>

        <div className={styles.auth_form_container}>
          <h1 className={styles.heading}>{isSignup ? "Sign up" : "Sign in"}</h1>

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
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      onChange={handleChange}
                      className={styles.input_feild}
                    />
                  </div>
                </div>
              </>
            )}

            <FormControl variant="outlined" className={styles.input_feild}>
              <InputLabel htmlFor="outlined-adornment-password">
                Email Address
              </InputLabel>
              <OutlinedInput
                name="email"
                id="outlined-adornment-password"
                value={formData.email}
                onChange={handleChange}
                labelWidth={70}
              />
            </FormControl>

            <FormControl variant="outlined" className={styles.input_feild}>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                name="password"
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                      onMouseDown={handleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>

            {isSignup && (
              <FormControl variant="outlined" className={styles.input_feild}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  name="confirmPassword"
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                        onMouseDown={handleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            )}
            <div>
              <div>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <button className={styles.submit_button}>
                    {isSignup ? "Sign Up" : "Sign In"}
                  </button>
                )}
              </div>

              <div className={styles.auth_option}>
                <span>or</span>
              </div>
            </div>
          </form>

          <div className={styles.auth_switch}>
            <a onClick={switchMode}>
              {isSignup
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign Up"}
            </a>
          </div>

          <Link to="forgot">
            <p className={styles.forgot_password}>Forgotten Password?</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
