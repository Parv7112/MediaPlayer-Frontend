import React, { useEffect, useState } from 'react';
import app from '../Firebase';
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import { onAuthStateChanged } from "firebase/auth";


const provider = new GoogleAuthProvider();

function Auth() {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(true);
  const [authentication, setAuthentication] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setAuthentication(true)
      }
      else {
        setAuthentication(false)
      }
    })
  }, [])

  const handleGoogleSignIn = () => {
    signInWithRedirect(auth, provider);
  };

  const handleLogOut = () => {
    signOut(auth);
    setAuthentication(false);
  }

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        const user = result.user;
        setLoading(false);
        if (user) {
          setAuthentication(true);
        }
        console.log(user, auth.currentUser)
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [auth]);

  return (
    <div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        authentication ? (
          <Dropdown>
            <Dropdown.Toggle variant='none' id="dropdown-basic" className='header-profile text-black rounded-circle '>
              <img src={auth.currentUser.photoURL} alt="Not Found" className='auth-img' />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogOut}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <button onClick={handleGoogleSignIn} className='fs-4 fw-bold header-bg'>Sign In</button>
        )
      )}
    </div>
  );
}

export default Auth;
