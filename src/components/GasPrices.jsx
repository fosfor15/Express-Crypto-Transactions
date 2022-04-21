import { useState } from 'react';
import axios from 'axios';

import IndicatorButton from './IndicatorButton';
import Input from './Input';

import useInterval from '../hooks/useInterval';
import '../styles/GasPrices.css';


function GasPrices({ gasParams, setTxGasPrice, setTxGasLimit }) {
    const [ gasPrices, setGasPrices ] = useState({
        safe: 0,
        propose: 0,
        fast: 0
    });

    const getGasPrices = async () => {
        const config = {
            method: 'GET',
            baseURL: 'https://api.bscscan.com/api'  ,
            params: {
                module: 'gastracker',
                action: 'gasoracle',
                apikey: '1JXXWEI5FCHWUBFRNAIN89K7DKWMQX5R7R'
            }
        };

        const response = await axios(config);
        const {
            SafeGasPrice: safe,
            ProposeGasPrice: propose,
            FastGasPrice: fast
        } = response.data.result;
        
        setGasPrices({
            safe: Math.round(safe),
            propose: Math.round(propose),
            fast: Math.round(fast)
        });
    };

    useInterval(getGasPrices, 5e3);


    return (
        <div className="gas-prices">
            <div className="indicator-buttons">
                <IndicatorButton
                    value={ 'S: ' + gasPrices.safe }
                    onClick={ setTxGasPrice }
                />
                <IndicatorButton
                    value={ 'P: ' + gasPrices.propose }
                    onClick={ setTxGasPrice }
                />
                <IndicatorButton
                    value={ 'F: ' + gasPrices.fast }
                    onClick={ setTxGasPrice }
                />
            </div>

            <div className="inputs">
                <Input
                    type="number"
                    min="5"
                    step="1"
                    placeholder="Gas Price"
                    value={ gasParams.price }
                    onChange={ setTxGasPrice }
                />
                <Input
                    type="number"
                    min="21000"
                    step="1000"
                    placeholder="Gas Limit"
                    value={ gasParams.limit }
                    onChange={ setTxGasLimit }
                />
            </div>
        </div>
    );
}

export default GasPrices;
