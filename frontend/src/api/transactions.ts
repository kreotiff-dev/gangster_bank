// src/api/transactions.ts

import axios from 'axios';

export const fetchCardTransactions = async (cardId: number) => {
    const response = await axios.get(`http://localhost:3000/api/cards/${cardId}/transactions`, {
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
  



