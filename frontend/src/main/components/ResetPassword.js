import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  // Extract token from URL
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/api/users/reset-password`, {
        token: resetToken,
        newPassword,
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
      setMessage('');
    }
  };

  useEffect(() => {
    if (!resetToken) {
      setError('Invalid or expired token');
    }
  }, [resetToken]);

  return (
    <Box mt={12}>
    <Container maxWidth="xs">
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          sx={{ marginTop: 2 }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          sx={{ marginTop: 2 }}
        />
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Reset Password
        </Button>
      </form>
      {message && <Typography color="success.main" sx={{ marginTop: 2 }}>{message}</Typography>}
      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
    </Container>
    </Box>
  );
};

export default ResetPassword;
