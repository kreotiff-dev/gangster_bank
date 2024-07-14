import axios from 'axios';
import { API_URL } from "../http";
// const apiUrl = process.env.REACT_APP_API_URL;

export const fetchUserCards = async (userId: string) => {
  const response = await axios.get(`${API_URL}/cards/`, {
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

export const fetchCardsBalance = async (userId: string) => {
  const response = await axios.get(`${API_URL}/cards/balance`, {
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