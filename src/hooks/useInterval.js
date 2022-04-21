import { useEffect } from 'react';

const useInterval = (callback, interval) => {
    useEffect(() => {
        callback();
        let intervalId = setInterval(callback, interval);
        return () => clearInterval(intervalId);
    }, []);
}

export default useInterval;
