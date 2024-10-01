import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users/';

const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL + 'login', { username, password });
    
    if (response.data.message === "Login successful") {

      // Αποθήκευση του αντικειμένου χρήστη στο localStorage
      console.log("The response was successful. The user is:", response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('LocalStorage:', localStorage.getItem('user'));
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


const signup = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'signup', userData);
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

export default {
  login,
  logout,
  signup,
};
