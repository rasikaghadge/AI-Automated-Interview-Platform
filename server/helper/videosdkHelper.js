import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL
const VIDEOSDK_TOKEN = process.env.VIDEOSDK_TOKEN
const API_AUTH_URL = null;


export const createVideoSdkRoom = async (options) => {
    const url = `${API_BASE_URL}/v2/rooms`;
    try {
        const response = await axios.post(url, {}, options);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const validateVideoSdkRoom = async (roomId) => {
    const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;
    const headers = {
        Authorization: `Bearer ${VIDEOSDK_TOKEN}`,
        "Content-Type": "application/json"
    };
    try {
        const response = await axios.get(url, { headers });
        const data = await response.data;
        const status = data ? data.roomId === roomId : false;
        return { status, data };
    } catch (error) {
        return false;
    }
}

export const fetchVideoSdkRooms = async (roomId) => {
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${VIDEOSDK_TOKEN}`,
            "Content-Type": "application/json"
        },
    };

    let url = `https://api.videosdk.live/v2/rooms?page=1&perPage=20`;

    // If a roomId is provided, modify the url to fetch that specific room
    if (roomId) {
        url = `https://api.videosdk.live/v2/rooms/${roomId}`;
    }

    try {
        const response = await axios(url, options);
        return response.data;
    } catch (error) {
        return null;
    }
}

export const deactivateVideoSdkRoom = async (roomId) => {
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${VIDEOSDK_TOKEN}`,
            "Content-Type": "application/json"
        },
        data: {
            "roomId": roomId
        },
    };

    const url = `https://api.videosdk.live/v2/rooms/deactivate`;

    try {
        const response = await axios(url, options);
        return response.data;
    } catch (error) {
        return null;
    }
}
