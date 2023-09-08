import React, { useEffect, useState } from 'react';
import app from '../Firebase';
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';

const provider = new GoogleAuthProvider();

function Auth() {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(true); 
  const [authentication, setAuthentication] = useState(false)

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
          setAuthentication(true); // Set authentication to true when user is logged in
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
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className='header-bg text-black fs-4 fw-bold'>
              <img src={auth.currentUser.photoURL} alt="Not Found" className='auth-img mx-2'/>
              {auth.currentUser.displayName}
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
