import React, { Component } from "react";
import { Input } from "semantic-ui-react";

/* The class to draw the Box Plot using the methods from box.js*/
class YearSlider extends Component {
  constructor(props) {
    super(props);
    this.values = [];
    this.handleChange = this.handleChange.bind(this);

    this.width = "150px";
  }

  handleChange(i, value) {
    this.values[i] = +value;
    this.props.onChange(this.values);
  }

  //render contains the layout of elements in the window of this plot
  //includes dropdowns, buttons, and other user interface
  render() {
    return (
      <div>
        <Input
          placeholder="Start Date"
          onChange={(_, data) => this.handleChange(0, data.value)}
          style={{ width: this.width }}
        />
        <span style={{ margin: "10px" }}>to</span>
        <Input
          placeholder="End Date"
          onChange={(_, data) => this.handleChange(1, data.value)}
          style={{ width: this.width }}
        />
      </div>
    );
  }
}

export default YearSlider;
