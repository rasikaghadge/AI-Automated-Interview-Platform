export const getToken = async () => {
      // get user token from localStorage
      const token = JSON.parse(localStorage.getItem('profile'));
      if (!token) {
        return null;
      }
      return token.token;
};

