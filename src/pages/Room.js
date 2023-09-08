import React from 'react';
import { useParams } from 'react-router-dom';

function RoomPage() {
    const { roomId, name } = useParams();

    return (
        <div>
            <h1 className='text-center'>Room - {roomId}</h1>
        </div>
    );
}

export default RoomPage;
