import { useState, useEffect, useMemo } from 'react';
import Button from './components/Button';
import StatusOutput from './components/StatusOutput';
import './styles/App.css';

function App() {
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
        if (!connectedAccount) {
            return;
        }

        const _status = status + 'Account is connected:\n' +
            connectedAccount.replace(/^(0x\w{10})\w+(\w{4})$/,
                (m, start, end) => `${start}.....${end}\n`);
        setStatus(_status);
    }, [ connectedAccount ]);


    // React-элемент
    return (
        <div className="App">
            <h1>Express Automation Script</h1>

            <div className="container">
                <div className="column-1">
                    <StatusOutput
                        status={ status }
                    />
                </div>

                <div className="column-2">
                    <Button
                        value={ connectedAccount ? 'Connected' : 'Connect wallet' }
                        handleClick={ connectWallet }
                    />
                </div>
            </div>
        </div>
    )
}

export default App;
