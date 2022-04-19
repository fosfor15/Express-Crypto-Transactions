import { useRef, useEffect } from 'react';
import Button from './Button';
import classes from '../styles/UI.module.css';

function StatusOutput({ status, setStatus }) {
    const textarea = useRef();

    useEffect(() => {
        textarea.current.scrollTop = textarea.current.scrollHeight;
    }, [ status ]);

    return (
        <div className="status-output">
            <h2>Status output</h2>

            <textarea
                className={ classes.textarea }
                readOnly
                ref={ textarea }
                value={ status }
            ></textarea>

            <div style={{ display: 'flex' }}>
                <Button
                    value="Clear status"
                    onClick={ () => setStatus('') }
                />
            </div>
        </div>
    );
}

export default StatusOutput;
