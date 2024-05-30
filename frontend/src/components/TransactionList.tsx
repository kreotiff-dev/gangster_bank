// src/components/TransactionList.tsx

import React, { useEffect, useState } from 'react';
import styles from '../styles/TransactionList.module.css';
import { fetchCardTransactions } from '../api/transactions';

interface Transaction {
  id: number;
  amount: number;
  transactionDate: string;
  transactionType: string;
}

interface TransactionListProps {
  cardId: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ cardId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const transactionsData = await fetchCardTransactions(cardId);
        setTransactions(transactionsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setLoading(false);
      }
    };

    loadTransactions();
  }, [cardId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!transactions.length) {
    return <div>No transactions available.</div>;
  }

  return (
    <div className={styles.transactionList}>
      <h3>Transaction History</h3>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <div>Amount: {transaction.amount}</div>
            <div>Date: {new Date(transaction.transactionDate).toLocaleString()}</div>
            <div>Type: {transaction.transactionType}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
