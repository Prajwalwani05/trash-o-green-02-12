import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/api/users/forgot-password`, { email });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
      setMessage('');
      console.log(err)
    }
  };

  return (
    <Box mt={12}>
    <Container maxWidth="xs">
      <Typography variant="h5">Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Send Reset Link
        </Button>
      </form>
      {message && <Typography color="success.main" sx={{ marginTop: 2 }}>{message}</Typography>}
      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
    </Container>
    </Box>
  );
};

export default ForgotPassword;
