import axios from 'axios';

export const fetchUserCards = async (userId: string) => {
  const response = await axios.get(`http://localhost:3000/api/cards/`, {
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
