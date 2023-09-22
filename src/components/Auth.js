import React, { useEffect, useState } from 'react';
import app from '../Firebase';
import { GoogleAuthProvider, getAuth, signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

const provider = new GoogleAuthProvider();

function Auth() {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        sendUserDataToBackend(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const handleGoogleSignIn = () => {
    signInWithRedirect(auth, provider);
  };

  const handleLogOut = () => {
    signOut(auth);
  };

  const sendUserDataToBackend = async (user) => {
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
    };

    try {
      const idToken = await user.getIdToken(); 
      // console.log('ID Token:', idToken);

      const response = await axios.post('http://localhost:4000/auth/sendUserData', { token: idToken, userData });
      console.log('User data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending user data:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (user) {
    return (
      <Dropdown>
        <Dropdown.Toggle variant='none' id="dropdown-basic" className='header-profile text-black rounded-circle '>
          <img src={user.photoURL} alt="Not Found" className='auth-img' />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleLogOut}>Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <button onClick={handleGoogleSignIn} className='fs-4 fw-bold header-bg'>
      Sign In
    </button>
  );
}

export default Auth;
