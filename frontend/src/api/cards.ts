import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchUserCards = async (userId: string) => {
  const response = await axios.get(`${apiUrl}/api/cards/`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (response.status !== 200) {
    throw new Error('Network response was not ok');
  }
  return response.data;
};
