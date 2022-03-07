import React, { useContext } from "react";
//Contexts
import { UserContext } from "../contexts/User";
//Styles
import "../styles/WalletConnect.css";
//Icons
import { Jazzicon } from "@ukstv/jazzicon-react";
//Utils
import { truncateAddr } from "../utils/helpers";

function WalletConnect() {
  const user = useContext(UserContext);
  console.log("User inside WalletConnect", user);

  const startFlow = () => {
    user.setConnected(true);
  };

  return (
    <div className="WalletConnect" onClick={startFlow}>
      {user.connected && user.currentUser ?
        (
        <div className="WalletConnected">
          <Jazzicon 
            address={user.currentUser.address}
            className="Jazzicon"
          />
          <p>{`${user.currentUser.network} connected: ${truncateAddr(user.currentUser.address)}`}</p>
        </div>
        ) 
      : 
        (<p>connect wallet</p>)
      }
      
    </div>
  )
}

export default WalletConnect