import { useRef, useEffect } from 'react';
import Button from './Button';

import classes from '../styles/UI.module.css';


function StatusOutput({ status, setStatus }) {
    const textarea = useRef();

    useEffect(() => {
        textarea.current.scrollTop = textarea.current.scrollHeight;
    }, [ status ]);

    return (
        <>
            <h2>Status output</h2>

            <textarea
                className={ classes.textarea }
                readOnly
                ref={ textarea }
                value={ status }
            ></textarea>

            <div className="flex-container">
                <Button
                    value="Clear status"
                    onClick={ () => setStatus('') }
                />
            </div>
        </>
    );
}

export default StatusOutput;
