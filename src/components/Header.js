import React from 'react';
import Auth from './Auth';
import Logo from '../assets/logo.png';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg mt-3 mx-3">
      <div className="container">
        <a className="navbar-brand fs-2 fw-bolder" href="#">
          <img src={Logo} alt="Logo" className='logo me-3' />
          Music Player
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto fs-4 fw-bold ">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <Auth />
      </div>
    </nav>
  );
};

export default Header;
