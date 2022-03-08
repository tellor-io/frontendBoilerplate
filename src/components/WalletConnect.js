import React, { useContext, useEffect, useState } from "react";
//Contexts
import { UserContext } from "../contexts/User";
//Styles
import "../styles/WalletConnect.css";
//Icons
import { Jazzicon } from "@ukstv/jazzicon-react";
import { CustomTooltip } from "./CustomTooltip";
//Utils
import { truncateAddr } from "../utils/helpers";

function WalletConnect() {
  const user = useContext(UserContext);
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    console.log("User inside WalletConnect", user);
  }, [user])
  
  const startFlow = () => {
    if (user) {
      user.setConnected(true);
    }
  };

  const showTrbBalance = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="WalletConnect" onClick={() => startFlow()}>
      {user && user.currentUser ?
        (
          <CustomTooltip
            open={showTooltip}
            title={
                user.currentUser.balances 
                ? 
                `Your TRB Balance: ${user.currentUser.balances.trb}` 
                : 
                "To switch accounts or networks, use Metamask extension."
              }
            placement="right"
            arrow
          >
            <div 
              className="WalletConnected" 
              onMouseEnter={() => showTrbBalance()}
              onMouseLeave={() => showTrbBalance()} 
            >
              <Jazzicon 
                address={user.currentUser.address}
                className="Jazzicon"
              />
              <p>{`${user.currentUser.network} connected: ${truncateAddr(user.currentUser.address)}`}</p>
            </div>
          </CustomTooltip>
        ) 
      : 
        (<p>connect wallet</p>)
      }
      
    </div>
  )
}

export default WalletConnect