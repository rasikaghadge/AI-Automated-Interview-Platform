import * as api from '../api/index'
import { AUTH, CREATE_PROFILE } from './constants'
import { useNavigate } from 'react-router-dom'


export const signin =(formData, openSnackbar, setLoading) => async(dispatch) => {

    try {
        //login the user
        const { data } = await api.signIn(formData)

        dispatch({ type: AUTH, data})
        // setLoading(false)
        openSnackbar("Signin successfully")
        // history.push('/dashboard')
        window.location.href="/homepage"

    } catch (error) {
        // console.log(error?.response?.data?.message)
        openSnackbar(error?.response?.data?.message)
        setLoading(false)
    }
}

export const signup =(formData, openSnackbar, setLoading) => async(dispatch) => {

    try {
        //Sign up the user
        const { data } = await api.signUp(formData)
        dispatch({ type: AUTH, data})
        const { info } = await api.createProfile({name: data?.result?.name, email: data?.result?.email, userId: data?.result?._id, role: data?.result?.role,  phoneNumber: '', businessName: '', contactAddress: '', logo: '', website: ''});
        dispatch({ type: CREATE_PROFILE, payload: info });
        window.location.href="/homepage"
        // history.push('/dashboard')
        openSnackbar("Sign up successfully")

    } catch (error) {
        console.log(error)
        openSnackbar(error?.response?.data?.message)
        setLoading(false)
    }
}



export const forgot =(formData) => async(dispatch) => {
    try {
        await api.forgot(formData)
    } catch (error) {
        console.log(error)
    }
}


export const reset =(formData, history) => async(dispatch) => {
    const navigate = useNavigate()
    try {
        await api.reset(formData)
        navigate('/homepage')

    } catch (error) {
        alert(error)
    }
}


export const refreshToken = async (user, navigate) => {
    try {
        const response = await api.refresh({ token: user?.refreshToken });
        if (response.statusText !== 'OK') {
            localStorage.removeItem("profile");
            navigate("/login");
        }
        const newToken = response.data.token;
        localStorage.setItem("profile", JSON.stringify({ ...user, token: newToken }));
    } catch (error) {
        console.log(error)
        localStorage.removeItem("profile");
        navigate("/login");
    }
}