import React from "react";
//Assets
import {ReactComponent as Tellor} from "../../assets/tellor_white.svg";
//Components
import WalletConnect from "./WalletConnect";
//Styles
import "../../styles/frontendBoilerplate/Nav.css";

function Nav() {
  return (
    <div className="Nav">
      <Tellor className="TellorLogo"/>
      <WalletConnect />
    </div>
  )
}

export default Nav