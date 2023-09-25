import React from 'react';
import banner from '../assets/banner-img.jpg'

function Home() {
    return (
        <div className='text-center'>
            <h1 className='mt-4 fw-bold fs-1'>Music Player</h1>
            <div className='mt-4'>
                <img src={banner} alt="Media Player" className='banner'/>
            </div>
        </div>
    );
}

export default Home;
