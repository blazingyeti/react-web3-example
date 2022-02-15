import React, { useState } from 'react'
import {ethers} from 'ethers'
import { Container, Card, Button } from 'react-bootstrap'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');

  const handleWalletConnect = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!');

      window.ethereum.request({ method: 'eth_requestAccounts'})
      .then(result => {
        accountChangedHandler(result[0]);
        setConnButtonText('Wallet Connected');
        getAccountBalance(result[0]);
      })
      .catch(error => {
        setErrorMessage(error.message);
      });

    } else {
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  }

  const accountChangedHandler = (newAccount) => {
    setUserAccount(newAccount);
    getAccountBalance(newAccount.toString());
  }

  const getAccountBalance = (account) => {
    window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
    .then(balance => {
      setUserBalance(ethers.utils.formatEther(balance));
    })
    .catch(error => {
      setErrorMessage(error.message);
    });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  }

  // listen for account changes
  window.ethereum.on('accountsChanged', accountChangedHandler);
  window.ethereum.on('chainChanged', chainChangedHandler);

  return (
    <Container className="d-grid p-3">
      {userAccount
      ? <Button variant='dark'>{userAccount}</Button>
      : <Button variant='dark' onClick={handleWalletConnect}>{connButtonText}</Button> }
      <Card>
        <Card.Body>Eth Balance: {userBalance}</Card.Body>
      </Card>
      {errorMessage}
    </Container>
  )
}

export default App;
