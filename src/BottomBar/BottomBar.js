import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./BottomBar.css";

class BottomBar extends Component {
  render() {
    return (
      <div class="loginBar">
        <div as={NavLink} to="/login" activeClassName="active" class="barItem">
          Login
        </div>
        <div
          as={NavLink}
          to="/raw"
          position="right"
          activeClassName="active"
          class="barItem"
        >
          View Raw Data
        </div>
      </div>
    );
  }
}

export default BottomBar;
