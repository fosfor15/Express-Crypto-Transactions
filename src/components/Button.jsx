import React from 'react';
import classes from '../styles/UI.module.css';

function Button({ value, handleClick }) {
    return (
        <button
            className={ classes.button }
            onClick={ handleClick }
        >
            { value }
        </button>
    );
}

export default Button;
