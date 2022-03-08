import React, { useState, createContext, useEffect } from 'react';
//Utils
import chains from "../utils/chains";
import minABI from "../utils/minimumABI.json"
//Web3
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const UserContext = createContext();

//Web3 Modal Globals
const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: "52474cef7b964b4fbf8e954a5dfa481b", // required
        },
    },
};
const web3Modal = new Web3Modal({
    providerOptions, // required
    cacheProvider: true,
});
//Globals
const tellorAddressMainnet = "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0";

const User = ({ children }) => {
    //Context State
    const [currentUser, setCurrentUser] = useState(null);
    const [connected, setConnected] = useState(false);
    const [setupUserError, setSetupUserError] = useState(null);
    const [eventsOn, setEventsOn] = useState(false);
    
    //Helpers
    const getAssetBalances = async (web3, address) => {
        //Instantiating Contracts
        const trbContract = new web3.eth.Contract(minABI, tellorAddressMainnet);
        //Main Chain Balance
        const ethBalance = web3.utils.fromWei(await web3.eth.getBalance(address));
        const trbBalance = await trbContract.methods
          .balanceOf(address)
          .call()
          .then((res) => web3.utils.fromWei(res));
        //Add more assets here if needed
        return {
            eth: Math.round(ethBalance * 100) / 100,
            trb: Math.round(trbBalance * 100) / 100,
        };
      };
    const setupUser = async () => {
        try {
            let user = { web3Modal: web3Modal };
            user.provider = await web3Modal.connect();
            user.web3 = new Web3(user.provider);
            const chainId = await user.web3.eth.getChainId();
            user.address = (await user.web3.eth.getAccounts())[0];
            user.network = chains[chainId];
            user.chainId = chainId;
            user.balances = (chainId === 1 || chainId === 4) ? (await getAssetBalances(user.web3, user.address)) : null;
            return user;
        } catch (err) {
            console.log(err);
            setSetupUserError(err.message);
        }
    };

    //UseEffect on "connected = true" flag,
    //sets up user and network
    useEffect(() => {
        if (web3Modal && connected) {
            web3Modal.clearCachedProvider();
            setupUser().then(res => {
                setCurrentUser(res);
            })
            setEventsOn(true);
        }
    }, [connected]) //eslint-disable-line

    //Turning on events subscription 
    //ONLY on first web3 injection 
    // (the above useEffect),
    //to prevent memory leaks and
    //keep event listeners cleaned up.
    if (currentUser && eventsOn) {
        // Subscribe to chains change
        window.ethereum.on("chainChanged", () => {
            setupUser().then(res => {
                setCurrentUser(res);
            })
        });
        // Subscribe to accounts change
        window.ethereum.on("accountsChanged", async (accounts) => {
            if (accounts.length === 0) {
                web3Modal.clearCachedProvider();
            } else {
                setupUser().then(res => {
                    setCurrentUser(res);
                });
            }
        });
        setEventsOn(false);
    }
    
    const UserContextObject = {
        currentUser: currentUser,
        connected: connected,
        setupUserError: setupUserError,
        setConnected: setConnected,
        setCurrentUser: setCurrentUser,
        setupUser: setupUser,
    }

    return (
        <UserContext.Provider value={UserContextObject}>
            {children}
        </UserContext.Provider >
    );
};

export default User;
