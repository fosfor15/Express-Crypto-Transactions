import { useState, useEffect, useMemo } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import StatusOutput from './components/StatusOutput';
import shortenAddress from './utils/shortenAddress';
import convertToHex from './utils/convertToHex';
import './styles/App.css';

function App() {
    // Состояние глобальных данных
    const [ status, setStatus ] = useState('');
    const [ connectedAccount, setConnectedAccounts ] = useState('');

    // Подключение аккаунта
    const connectWallet = () => {
        ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                console.log('Accounts :>> ', accounts);
                setConnectedAccounts(accounts[0]);
            })
            .catch(error => console.log('Error :>> ', error));
    };

    // Смена аккаунтов
    useEffect(() => {
        ethereum.on('accountsChanged', accounts => {
            console.log('Accounts :>> ', accounts);
            setConnectedAccounts(accounts[0]);
        });
    }, []);

    // Вывод подключение аккаунта в статус
    useMemo(() => {
        if (!connectedAccount) return;
        const _status = status + 'Account is connected:\n' +
            shortenAddress(connectedAccount);
        setStatus(_status);
    }, [ connectedAccount ]);


    // Состояние параметров транзакции
    const [ txAddress, setTxAddress ] = useState('');
    const [ txValue, setTxValue ] = useState('');
    const [ txHashes, setTxHashes ] = useState([]);

    const changeTxAddress = (event) => {
        if (!/^0x/.test(event.target.value)) {
            console.log('Error in Tx Address');
            return;
        }
        setTxAddress(event.target.value);
    };

    const extendTxAddressOutput = (event) => {
        if (!txAddress) return;
        event.target.value = txAddress;
    };

    const shortenTxAddressOutput = (event) => {
        event.target.value = shortenAddress(event.target.value);
    };    

    const changeTxValue = (event) => {
        setTxValue(event.target.value);
    };

    // Запуск транзакции
    const startTransaction = () => {
        if (!connectedAccount) {
            setStatus(status + 'Connect account\n');
            return;
        }

        if (!txAddress) {
            setStatus(status + 'Enter Tx Address\n');
            return;
        }

        if (!txValue) {
            setStatus(status + 'Enter Tx Value\n');
            return;
        }

        const _status = status + 'Start transaction to\n' +
            shortenAddress(txAddress) + 'value of\n' + txValue + '\n';
        setStatus(_status);

        const transactionParameters = {
            chainId: '0x38',
            from: connectedAccount,
            to: txAddress,
        
            value: convertToHex(txValue * 1e18),
        
            gasPrice: convertToHex(5e9),
            gas: convertToHex(21e3)
        };

        ethereum.request({
            method: 'eth_sendTransaction',
            params: [ transactionParameters ]
        })
        .then(txHash => {
            setStatus(status + 'Tx Hash\n' + txHash);
            setTxHashes([ ...txHashes, txHash ]);
            setTxAddress('');
            setTxValue('');
        })
        .catch(error => console.log('Error :>> ', error));
    };


    // React-элемент
    return (
        <div className="App">
            <h1>Express Automation Script</h1>

            <div className="container">
                <div className="column-1">
                    <StatusOutput
                        status={ status }
                        setStatus={ setStatus }
                    />
                </div>

                <div className="column-2">
                    <Button
                        value={ connectedAccount ? 'Connected' : 'Connect wallet' }
                        onClick={ connectWallet }
                    />
                    <Input
                        type="text"
                        placeholder="Tx Address"
                        onChange={ changeTxAddress }
                        onFocus={ extendTxAddressOutput }
                        onBlur={ shortenTxAddressOutput }
                    />
                    <Input
                        type="number"
                        step="1e-2"
                        min="0"
                        placeholder="Tx Value"
                        value={ txValue }
                        onChange={ changeTxValue }
                    />
                    <Button
                        value="Start"
                        onClick={ startTransaction }
                    />
                </div>
            </div>
        </div>
    )
}

export default App;
