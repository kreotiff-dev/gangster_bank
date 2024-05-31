import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchCardTransactions = async (cardId: number) => {
    const response = await axios.get(`${apiUrl}/api/cards/${cardId}/transactions`, {
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
  



