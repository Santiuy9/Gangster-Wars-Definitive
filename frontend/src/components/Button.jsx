import React from 'react';
import { Link } from 'react-router-dom';
import './css/Button.css'

export default function Boton({ label, to }) {
    return (
        <Link to={to}>
            <div className='custom-button'>
                {label}
            </div>
        </Link>
    )
}