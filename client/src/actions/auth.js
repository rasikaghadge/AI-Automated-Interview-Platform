import { useNavigate } from 'react-router-dom';
import * as api from '../api/index';
import { AUTH, CREATE_PROFILE } from './constants';
import { jwtDecode } from 'jwt-decode';

export const signin = (formData, setLoading) => async (dispatch) => {
  try {
    //login the user
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });
    window.location.href = '/';
  } catch (error) {
    setLoading(false);
  }
};

export const signup = (formData, setLoading) => async (dispatch) => {
  try {
    //Sign up the user
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    const { info } = await api.createProfile({
      name: data?.result?.name,
      email: data?.result?.email,
      userId: data?.result?._id,
      role: data?.result?.role,
      phoneNumber: '',
      businessName: '',
      contactAddress: '',
      logo: '',
      website: '',
    });
    dispatch({ type: CREATE_PROFILE, payload: info });
    window.location.href = '/';
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};

export const forgot = (formData) => async (dispatch) => {
  try {
    await api.forgot(formData);
  } catch (error) {
    console.log(error);
  }
};

export const reset = (formData, history) => async (dispatch) => {
  const navigate = useNavigate();
  try {
    await api.reset(formData);
    navigate('/homepage');
  } catch (error) {
    alert(error);
  }
};

export const refreshToken = async (user) => {
  try {
    const response = await api.refresh({ token: user?.refreshToken });
    if (response.statusText !== 'OK') {
      localStorage.removeItem('profile');
      return false;
    }
    const newToken = response.data.token;
    localStorage.setItem(
      'profile',
      JSON.stringify({ ...user, token: newToken })
    );
    return true;
  } catch (error) {
    console.log(error);
    localStorage.removeItem('profile');
    return false;
  }
};

export const checkUserRole = (user) => {
  try {
    let userRole = '';
    const decodedToken = jwtDecode(user.token);
    if (decodedToken) {
      userRole = decodedToken.role;
    }
    return { id: decodedToken.id, role: userRole };
  } catch (error) {
    return { id: null, role: '' };
  }
};
