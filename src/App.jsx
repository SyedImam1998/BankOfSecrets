import React,{useRef,useState,useEffect} from 'react';
import Web3 from 'web3';
import {
  concatSig,
  encrypt
} from '@metamask/eth-sig-util';
import './App.css';
import BankofSecret from './Bankofsecrets.json';
import Loader from './Loader';

const App=()=>{

useEffect(() => { window.process = { ...window.process, }; }, []);
  
const [msg,setMsg]=useState("");
const [account,setAccount]=useState("")
const[loader,setLoader]=useState(false);
const[cipher,setCipher]=useState("");

const msgRef=useRef(null);
const keyRef=useRef(null);
const gKeyRef=useRef(null);
var secretManager;

// useEffect(()=>{
//   if(window.ethereum) {
//     // window.ethereum.on('chainChanged', () => {
//     //   window.location.reload();
//     // })
//     window.ethereum.on('accountsChanged', () => {
//       window.location.reload();
//     })}
// },);


 const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
     

  
    } catch (error) {
      console.log(error);
    }
  }
  
const encrypt_save=async()=>{

var message= msgRef.current.value.toString();
var key=keyRef.current.value;

  
  
  let encryptionPublicKey;
await window.ethereum.request({
  method:'eth_getEncryptionPublicKey',
  params:[account],
}).then((result)=>{
  encryptionPublicKey=result
}).catch((error) => {
  if (error.code === 4001) {
    // EIP-1193 userRejectedRequest error
    console.log("We can't encrypt anything without the key.");
  } else {
    console.error(error);
  }
});

var text = stringifiableToHex(encrypt({
  publicKey: encryptionPublicKey,
  data: message,
  version: 'x25519-xsalsa20-poly1305',
}))
setLoader(true);
  
const web3= new Web3(window.ethereum);
  const netId= await web3.eth.net.getId();
  const accounts= await web3.eth.getAccounts();
   setAccount(accounts[0]);
  secretManager= new web3.eth.Contract(BankofSecret.abi,BankofSecret.networks[netId].address)
var n=await secretManager.methods.addSecret(key,text).send({from:account}).then((res)=>{
setLoader(false);
alert("Secrets Saved SuccessFully!!!");

msgRef.current.value="";
keyRef.current.value="";

})
}

const stringifiableToHex=(value)=>{
  const web3= new Web3(window.ethereum);

  return web3.utils.toHex(Buffer.from(JSON.stringify(value)),'utf8');
}


const decrypt=async()=>{

const web3= new Web3(window.ethereum);
  const netId= await web3.eth.net.getId();
  const accounts= await web3.eth.getAccounts();
   setAccount(accounts[0]);
  secretManager= new web3.eth.Contract(BankofSecret.abi,BankofSecret.networks[netId].address);
await secretManager.methods.getSecret(gKeyRef.current.value.toString()).call({from:account}).then(async(res)=>{


await window.ethereum
.request({
  method: 'eth_decrypt',
  params: [res,account],
})
.then((decryptedMessage) =>{
  setMsg(decryptedMessage);
  gKeyRef.current.value="";
}
)
.catch((error) => console.log(error.message)); 

})
  // var text= gKeyRef.current.value ;
 

}




  return(<div>
   
    <ul className="background">
    <h2 className="header">BANK OF SECRETS</h2>
    {/* <button onClick={nFoot}>Check</button> */}
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
</ul>

    <Loader showLoader={loader}></Loader>
   {account?( <div className='imp'>

  
    <div className='saveSecret'>
      <h3>Save Secret</h3>
      <label>Key:</label>
      <input type="text" ref={keyRef}></input> <br></br>
      <label>Data:</label><br></br>
      <textarea rows="4" cols="50" name="comment" form="usrform" ref={msgRef}></textarea><br></br>

      <button onClick={encrypt_save}>Encrypt & Save</button>

    </div>
    <div className='getSecret'>
      <h3>Get Secret</h3>
      <label>Key:</label>
      <input type="text" ref={gKeyRef}></input><br></br>
      <textarea rows="4" cols="50" name="comment" form="usrform" value={msg}></textarea><br></br>
      <button onClick={decrypt}>Decrypt</button>
    </div>
    </div>):(<div className="imp"><button className="connectWalletbtn" onClick={connectWallet}>Connect Wallet</button><br></br>
    <a className='how' href="https://docs.google.com/document/d/1phSTU-r_ep8tw7nPxQE9q1fx2fHVzyftgf9qJ-MVg6g/edit#">How to Use</a>
    </div>)}
  </div>)
}
export default App;