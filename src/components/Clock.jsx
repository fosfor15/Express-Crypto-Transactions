import { useState, useEffect } from 'react';

const time = new Date();

const getTimeString = (time) => {
    return {
        utc: time.toLocaleTimeString('ru-RU', { timeZone: 'UTC' }),
        local: time.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' })
    };
}

const Clock = () => {
    const [ timeString, setTimeString ] = useState(getTimeString(time));

    useEffect(() => {
        let intervalId = setInterval(() => {
            time.setTime(Date.now());
            setTimeString(getTimeString(time));
        }, 1e3);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="clock">
            <time>{ timeString.utc }</time>UTC
            <time>{ timeString.local }</time>UTC +3
        </div>
    );
}

export default Clock;
