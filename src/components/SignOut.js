import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SignOut = () => {
  const navigate = useNavigate();
  useEffect(() => {
    
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('username');
    navigate('/');
  }, []); 

    
  

  return (
    <>

    </>
  );
};

export default SignOut;