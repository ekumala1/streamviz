import React, { Component } from 'react';
import { Input, Dropdown } from 'semantic-ui-react';

/* The class to draw the Box Plot using the methods from box.js*/
class Filter extends Component {
  constructor(props) {
    super(props);
    this.values = [];
    this.handleChange = this.handleChange.bind(this);
    this.selectVariable = this.selectVariable.bind(this);

    this.width = '150px';
  }

  selectVariable(_, data) {
    this.variable = data.value;
  }

  handleChange(i, value) {
    this.values[i] = +value;
    this.props.onChange(this.variable, this.values);
  }

  //render contains the layout of elements in the window of this plot
  //includes dropdowns, buttons, and other user interface
  render() {
    return (
      <div>
        <Dropdown
          placeholder="Variable"
          selection
          options={this.props.variables}
          onChange={this.selectVariable}
        />
        <Input
          placeholder="Start Value"
          onChange={(_, data) => this.handleChange(0, data.value)}
          style={{ width: this.width }}
        />
        <span style={{ margin: '10px' }}>to</span>
        <Input
          placeholder="End Value"
          onChange={(_, data) => this.handleChange(1, data.value)}
          style={{ width: this.width }}
        />
      </div>
    );
  }
}

export default Filter;
