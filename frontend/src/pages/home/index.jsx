import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Home = () => {
  const navigate = useNavigate(); // useNavigate hook

  const goToLocationShare = () => {
    navigate('/locationShare'); // Navigate programmatically
  };

  return (
    <div className='home'>
      <h1>Home Page</h1>
      <button onClick={goToLocationShare}>Go to Location Share</button>
    </div>
  );
};

export default Home;
