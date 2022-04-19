import { useState, useMemo } from 'react';
import Button from './components/Button';
import StatusOutput from './components/StatusOutput';
import './styles/App.css';

function App() {
    const [ status, setStatus ] = useState('');
    const [ accounts, setAccounts ] = useState([]);

    const connectWallet = () => {
        ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                setAccounts(accounts);
                console.log('accounts :>> ', accounts);
            })
            .catch(error => console.log('error :>> ', error));
    };

    useMemo(() => {
        if (accounts.length == 0) {
            return;
        }

        const accountsShort = accounts.reduce((result, account, ind) =>
            result + account.replace(/^(0x\w{10})\w+(\w{4})$/,
                (m, start, end) => `${++ind}. ${start}.....${end}\n`)
        , '');
        
        const _status = status + 'Accounts connected:\n' +
            accountsShort;
        setStatus(_status);
    }, [ accounts ]);

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
                        value="Connect wallet"
                        handleClick={ connectWallet }
                    />
                </div>
            </div>
        </div>
    )
}

export default App;
