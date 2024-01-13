/* eslint-disable no-unused-vars */
const API_BASE_URL = "https://api.videosdk.live";
// const VIDEOSDK_TOKEN = process.env.REACT_APP_VIDEOSDK_TOKEN;
const VIDEOSDK_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5Y2VkNGZjNC1kZWY1LTQxOGMtYTNmNC0wZmRiYWE2Y2JlYzUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5Nzk1MzAxNCwiZXhwIjoxNjk4MDM5NDE0fQ.d2_ATd7vdR2yAP9mihSurFpgpiVZYfJr1VanudCxvNI"

const API_AUTH_URL = process.env.REACT_APP_AUTH_URL;

export const getToken = async () => {
      // get user token from localStorage
      const token = JSON.parse(localStorage.getItem('profile'));
      if (!token) {
        return null;
      }
      return token.token;
};

export const createMeeting = async ({ token }) => {
  const url = `${API_BASE_URL}/v2/rooms`;
    const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const { roomId } = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.error("error", error));

  return roomId;
};

export const validateMeeting = async ({ roomId, token }) => {
  const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;
  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const result = await fetch(url, options)
    .then((response) => response.json()) //result will have meeting id
    .catch((error) => console.error("error", error));

  return result ? result.roomId === roomId : false;
};