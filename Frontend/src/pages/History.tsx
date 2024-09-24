import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  type: string;
  ticker: string;
  price: number;
  shares: number;
  time: string;
}

const History: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/history',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
        })
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transaction history:', err);
      }
    };
    fetchTransactionHistory();
  }, []);

  return (
    <div>
      <h1>Transaction History</h1>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Ticker</th>
            <th>Price</th>
            <th>Shares</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.type}</td>
              <td>{transaction.ticker}</td>
              <td>{transaction.price}</td>
              <td>{transaction.shares}</td>
              <td>{transaction.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;