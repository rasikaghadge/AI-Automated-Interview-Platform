import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const NODE_ENV = process.env.NODE_ENV
let url;
if (NODE_ENV === 'development') {
    url = 'http://localhost:5000'
} else {
    url = process.env.REACT_APP_API
}
export const baseURL = url;
const API = axios.create({ baseURL: baseURL})


API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    // console.log(req);
    return req
})


export const fetchClient = (id) => API.get(`/clients/${id}`);
export const fetchClients = (page) => API.get(`/clients?page=${page}`);
export const addClient =( client ) => API.post('/clients', client)
export const updateClient = (id, updatedClient) => API.patch(`/clients/${id}`, updatedClient)
export const deleteClient =(id) => API.delete(`/clients/${id}`)
export const fetchClientsByUser = (searchQuery) => API.get(`/clients/user?searchQuery=${searchQuery.search}`);


export const signIn =(formData)=> API.post('/users/signin', formData)
export const signUp =(formData)=> API.post('/users/signup', formData)
export const forgot = (formData) => API.post('/users/forgot', formData);
export const reset = (formData) => API.post('/users/reset', formData);

export const fetchProfilesBySearch = (searchQuery) => API.get(`/profiles/search?searchQuery=${searchQuery.search || searchQuery.year || 'none'}`);
export const fetchProfile = (id) => API.get(`/profiles/${id}`)
export const fetchProfiles = () => API.get('/profiles');
export const fetchProfilesByUser = (searchQuery) => API.get(`/profiles?searchQuery=${searchQuery.search}`)
export const createProfile = (newProfile) => API.post('/profiles', newProfile);
export const updateProfile = (id, updatedProfile) => API.patch(`/profiles`, updatedProfile);
export const deleteProfile = (id) => API.delete(`/profiles/${id}`);

export const getInterviewsCandidate = (id) => API.get(`/interviews/candidate/${id}`);
export const getInterviewsHR = (id) => API.get(`/interviews/hr/${id}`);

export const listMeetings = () => API.get('/meetings');
export const getMeeting = (id) => API.get(`/meetings/${id}`);
// export const scheduleMeeting = (meetingData) => API.post('/schedule', meetingData);
export const scheduleMeeting = (formData) => API.post(`/interviews/schedule`, formData);