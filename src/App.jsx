import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import Button from './components/Button';
import Input from './components/Input';
import StatusOutput from './components/StatusOutput';

import shortenAddress from './utils/shortenAddress';
import convertToHex from './utils/convertToHex';
import './styles/App.css';


function App() {
    // Состояния глобальных данных
    const [ status, setStatus ] = useState('');
    const [ account, setAccounts ] = useState({ full: '', short: '' });

    // Подключение аккаунта
    const connectAccount = () => {
        ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                if (accounts[0] == account.full) return;
                console.log('Accounts :>> ', accounts);
                setAccounts({
                    full: accounts[0],
                    short: shortenAddress(accounts[0])
                });
            })
            .catch(error => console.log('Error :>> ', error));
    };

    // Смена аккаунтов
    useEffect(() => {
        ethereum.on('accountsChanged', accounts => {
            console.log('Accounts :>> ', accounts);
            setAccounts({
                full: accounts[0],
                short: shortenAddress(accounts[0])
            });
        });
    }, []);

    // Вывод подключения аккаунта
    useMemo(() => {
        if (!account.short) return;
        setStatus(status + `Account ${account.short} is connected\n`);
    }, [ account.short ]);


    // Состояния и функции изменения параметров транзакции
    const [ txAddress, setTxAddress ] = useState('');
    const [ txValue, setTxValue ] = useState('');
    const [ txHash, setTxHash ] = useState('');

    const changeTxAddress = (event) => {
        if (!/^0x/.test(event.target.value)) {
            setStatus(status + 'Error in Tx Address\n');
            return;
        }
        setTxAddress(event.target.value);
    };

    const extendTxAddressOutput = (event) => {
        if (!txAddress) return;
        event.target.value = txAddress;
    };

    const shortenTxAddressOutput = (event) => {
        if (!event.target.value) return;
        event.target.value = shortenAddress(event.target.value);
    };

    const changeTxValue = (event) => {
        setTxValue(event.target.value);
    };

    // Запуск транзакции
    const startTransaction = () => {
        if (!account) {
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
            from: account.full,
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
            console.log('txHash :>> ', txHash);
            setStatus(status + 'Tx Hash\n' + txHash + '\n');
            setTxHash(txHash);
            getTxStatus(txHash);
        })
        .catch(error => console.log('Error :>> ', error));
    };


    // Функция для проверки статуса транзакции
    const getTxStatus = (txHash) => {
        console.log('txHash :>> ', txHash);

        const config = {
            method: 'GET',
            baseURL: 'https://api.bscscan.com/api'  ,
            params: {
                module: 'transaction',
                action: 'gettxreceiptstatus',
                txhash: txHash,
                apikey: '1JXXWEI5FCHWUBFRNAIN89K7DKWMQX5R7R'
            }
        };
        console.log('config :>> ', config);

        const sendRequest = () => {
            setTimeout(() => {
                sendRequest.count++;
                
                axios(config).then(response => {
                    console.log(`Result ${sendRequest.count} :>> `, response.data.result.status);
        
                    if (response.data.result.status == '1') {
                        setStatus(status + `Try ${sendRequest.count}\n`
                            + 'Transaction is completed!\n');
                    } else {
                        setStatus(status + `Try ${sendRequest.count}\n`
                            + 'Transaction is failed!\n');
    
                        if (sendRequest.count < 15) {
                            sendRequest();
                        } else {
                            startTransaction();
                        }
                    }
                });
            }, 2e3);
        };
        sendRequest.count = 0;

        sendRequest();
    };


    // React-элемент
    return (
        <div className="App">
            <div className="flex-container">
                <h1>Express Automation</h1>
                <div>
                    
                </div>
            </div>

            <div className="flex-container">
                <div className="status-output">
                    <StatusOutput
                        status={ status }
                        setStatus={ setStatus }
                    />
                </div>

                <div className="control-interface">
                    <div className="account-connection">
                        <Button
                            value={ account ? 'Connected' : 'Connect account' }
                            onClick={ connectAccount }
                        />
                        <p>{ account.short }</p>
                    </div>
                    
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
