import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users/';

const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL + 'login', { username, password });
    if (response.user) {
      // Αποθήκευση του αντικειμένου χρήστη στο localStorage
      console.log('response:', response);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.error('No response received:', error.request);
      return { message: 'No response from server' };
    } else {
      console.error('Error', error.message);
      return { message: 'Request error' };
    }
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  login,
  logout,
};
