import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
}));

export default function Orders() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(
            `${REACT_APP_API_URL}/api/purchasedProduct/getPurchasedProduct`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data && response.data.length > 0) {
            setProducts(response.data);
          } else {
            setError('No bookings found');
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
          setError('Failed to fetch bookings');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Please log in to view your bookings');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [REACT_APP_API_URL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box pt={12} sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {products.map((product, index) => (
          <Grid key={index} item xs={2} sm={4} md={4}>
            <Item>
              <h3>{JSON.parse(product.productName)[0]}</h3>
              <p><strong>Address:</strong> {JSON.parse(product.address).join(', ')}</p>
              <p><strong>Amount:</strong> {product.amount}</p>
              <p><strong>Area:</strong> {product.area}</p>
              <p><strong>Order Status:</strong> {product.orderStatus}</p>
              <p><strong>Payment Status:</strong> {product.paymentStatus}</p>
              <img src={JSON.parse(product.productImage)[0]} alt={JSON.parse(product.productName)[0]} style={{ width: '100%', height: 'auto' }} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
