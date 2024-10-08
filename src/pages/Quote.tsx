import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import url from '@/lib/url';

const GetQuote: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [stockQuote, setStockQuote] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false)
  const handleGetQuote = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }
  
      const res = await axios.post(
        `${url}/quote`,
        { symbol },
        {
          headers: {
            Authorization: `${token}`, 
          },
        }
      );
      
      setStockQuote(res.data);
      setError('');
    } catch (err) {
      setStockQuote(null);
      setError('Invalid symbol or error fetching quote.');
    }
    finally { 
      setLoading(false)
    }
  };
  
  return (
    <div className='flex flex-col justify-center w-1/2 mx-auto border border-neutral-400 shadow-md mt-5 rounded-xl p-6'>
      <h1 className='text-2xl font-semibold'>Get Quote</h1>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol"
        className='border border-black hover:border-green-700 hover:border-2 my-5 rounded-full px-4 py-4 w-1/2 dark:text-black'
      />
      <div>
        <h2 className='text-neutral-700 my-2'>Stock symbol example : MSFT, AAPL, V, TSLA</h2>
      </div>
      <Button onClick={handleGetQuote} className='bg-green-600 px-4 py-8 rounded-xl text-white text-2xl font-semibold'>{loading ? 'Loading...' : "Get Price"}</Button>
      {stockQuote && (
        <Card className='px-6 py-4 my-5'>
          <CardTitle className='text-2xl font-semibold'>Name: {stockQuote.name}</CardTitle>
          <CardDescription className='text-xl font-semibold'>Price: ${stockQuote.price}</CardDescription>
        </Card>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default GetQuote;