import React, { useState } from 'react';
import axios from 'axios';

const GetQuote: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [stockQuote, setStockQuote] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGetQuote = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStockQuote(res.data);
      setError('');
    } catch (err) {
      setStockQuote(null);
      setError('Invalid symbol or error fetching quote.');
    }
  };

  return (
    <div>
      <h1>Get Quote</h1>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol"
      />
      <button onClick={handleGetQuote}>Get Quote</button>
      {stockQuote && (
        <div>
          <p>Name: {stockQuote.name}</p>
          <p>Symbol: {stockQuote.ticker}</p>
          <p>Price: {stockQuote.price}</p>
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default GetQuote;