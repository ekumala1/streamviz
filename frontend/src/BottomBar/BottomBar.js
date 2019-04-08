import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class BottomBar extends Component {
  render() {
    return (
      <Menu>
        <Menu.Item as={Link} to="/login">
          Login
        </Menu.Item>
        <Menu.Item as={Link} to="/raw" position="right">
          View Raw Data
        </Menu.Item>
      </Menu>
    );
  }
}

export default BottomBar;
