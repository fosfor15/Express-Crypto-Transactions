import React from 'react';
import classes from '../styles/UI.module.css';

function StatusOutput({ status }) {
    return (
        <div className="status-output">
            <textarea
                className={ classes.textarea }
                readOnly
                value={ status }
            ></textarea>
        </div>
    );
}

export default StatusOutput;
