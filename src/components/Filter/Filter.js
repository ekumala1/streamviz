import React, { Component } from "react";
import { Input, Dropdown } from "semantic-ui-react";

/* The class to draw the Box Plot using the methods from box.js*/
class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = { variable: "", values: [] };
    this.handleChange = this.handleChange.bind(this);

    this.width = "150px";
  }

  handleChange(i, value) {
    if (i === 3) {
      this.setState({ variable: value });
    } else {
      var values = this.state.values;
      values[i] = value;
      this.setState({ values: values });
    }

    // if (this.state.variable !== "" && this.state.values.length === 2) {
    if (true) {
      this.props.onChange(this.variable, this.values);
      console.log("onchange");
    }
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
          onChange={(_, data) => this.handleChange(3, data.value)}
          value={this.props.variable}
        />
        <Input
          placeholder="Start Value"
          onChange={(_, data) => this.handleChange(0, data.value)}
          style={{ width: this.width }}
          value={this.props.values[0]}
        />
        <span style={{ margin: "10px" }}>to</span>
        <Input
          placeholder="End Value"
          onChange={(_, data) => this.handleChange(1, data.value)}
          style={{ width: this.width }}
          value={this.props.values[1]}
        />
      </div>
    );
  }
}

export default Filter;
