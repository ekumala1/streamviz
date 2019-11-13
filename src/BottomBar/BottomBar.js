import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./BottomBar.css";
/* The bar at the base of the main view, which currently consists
of only the View Raw Data tab*/
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
