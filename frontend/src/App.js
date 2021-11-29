import { ethers } from 'ethers';
import Reward from './RewardContributors.json';
import Token from './Token.json';
import { useState } from 'react';
import './App.css';
 
function App() {
  const [ balance, setBalance ] = useState(0);
  const [ allowance, setAllowance ] = useState(0);
  const [ approveValue, setApproveValue ] = useState(0);
  const [ contributor, setContributor ] = useState(0);
  const [ grantedTokens, setGrantedTokens ] = useState(0);
  const [ reward, setReward ] = useState(0);
  const [ contributorListVisibility, setContributorListVisibility] = useState(false);
  const [ bestContributorVisibility, setBestContributorVisibility] = useState(false);
  const [ contributorList, setContributorList ] = useState(0);
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    setContributorListVisibility(false);
    setBestContributorVisibility(false);
  }
 
  async function fetchBalance() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        const balance = await contract.getBalance(signer.getAddress());
        const newBalance = (balance / Math.pow(10,5));
        setBalance(newBalance.toString());
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }
 
  async function approve() {
    if (!approveValue) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Token.address, Token.abi, signer);
      try {
        await contract.approve(Reward.address, approveValue);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }
 
  async function getAllowance() {
    await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(Token.address, Token.abi, provider);
      try {
        const allowance = await contract.allowance(provider.getSigner().getAddress(), Reward.address);
        setAllowance(allowance.toString());
      } catch (err) {
        console.log('Error: ', err);
      }
  }
 
  async function addContributor() {
    if (!contributor) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        await contract.addContributor(contributor);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function removeContributor() {
    if (!contributor) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        await contract.removeContributor(contributor);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }
  
  async function getContributorList() {
    await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(Reward.address, Reward.abi, provider);
      try {
        const contributors = await contract.listContributors();
        setContributorList(contributors);
        setContributorListVisibility(true);
        console.log(contributors);
      } catch (err) {
        console.log('Error: ', err);
      }
  }

  async function getContributorWithMostRewards() {
    await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        const contributor = await contract.contributorWithMostRewards();
        setContributorList(contributor);
        setBestContributorVisibility(contributor);
        console.log(contributor);
      } catch (err) {
        console.log('Error: ', err);
      }
  }

  async function startEpoch() {
    if (!grantedTokens) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        await contract.startEpoch(grantedTokens);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function endEpoch() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        await contract.endEpoch();
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }


  async function optIn() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        await contract.optIn();
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function optOut() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        await contract.optOut();
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function rewardContributor() {
    if (!contributor) return
    if (!reward) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Reward.address, Reward.abi, signer);
      try {
        console.log(contributor);
        console.log(reward);
        await contract.contribute(contributor, reward);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  return (
    <div>
    <div class="split left">
      <div class="centered">
      <h1> Admin </h1>
        <input type="text" onChange={e => setContributor(e.target.value)} placeholder="Contributor Address" /><br />
        <button className="button" onClick={addContributor}>Add Contributor</button>&nbsp;
        {/* <input type="text" onChange={e => setContributor(e.target.value)} placeholder="Contributor Address" /> */}
        <button className="button" onClick={removeContributor}>Remove Contributor</button><br /><br />
        <input type="text" onChange={e => setGrantedTokens(e.target.value)} placeholder="Number of tokens" />&nbsp;
        <button className="button" onClick={startEpoch}>Start Epoch</button><br /><br />
        <button className="button" onClick={endEpoch}>End Epoch</button><br /><br />
        <button className="button" onClick={getContributorWithMostRewards}>Best Contributor</button><br /><br />
        { bestContributorVisibility && 
          <p>{contributorList}</p>
        }
        <button className="button" onClick={getContributorList}>Get Contributors List</button><br />
        { contributorListVisibility && 
          <ol>
            {contributorList.map(name => (
              <li>
                {name}
              </li>
            ))} 
          </ol> 
        }
      </div>
    </div>
    <div class="split right">
    <div class="centered">
        <h1> Contributor </h1>
        <button className="button" onClick={fetchBalance}>Get Balance</button>
        <p>Balance: {balance}</p>
        <input type="text" onChange={e => setApproveValue(e.target.value)} placeholder="Contributor Allowance" />&nbsp;
        <button className="button" onClick={approve}>Approve Allowance</button><br /><br />
        <button className="button" onClick={getAllowance}>Get Allowance</button>
        <p>Allowance: {allowance}</p>
        <button className="button" onClick={optIn}>Opt In</button>&nbsp;
        <button className="button" onClick={optOut}>Opt Out</button><br /><br/>
        <input type="text" onChange={e => setContributor(e.target.value)} placeholder="Contributor Address" />&nbsp;
        <input type="text" onChange={e => setReward(e.target.value)} placeholder="Amount to Contribute" />
        <button className="button" onClick={rewardContributor}>Reward</button><br />
    </div>
    </div>
    </div>
);
}
 
export default App;