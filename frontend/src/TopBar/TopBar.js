import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class TopBar extends Component {
  render() {
    return (
      <Menu widths={3}>
        <Menu.Item as={Link} to="/box">
          Box Plot
        </Menu.Item>
        <Menu.Item as={Link} to="/scatter">
          Scatter Plot
        </Menu.Item>
        <Menu.Item as={Link} to="/time">
          Time Series Graph
        </Menu.Item>
      </Menu>
    );
  }
}

export default TopBar;
