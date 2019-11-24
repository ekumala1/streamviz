import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import "font-awesome/css/font-awesome.min.css";
import Filter from "../Filter/Filter";

/* The class to draw the Box Plot using the methods from box.js*/
class MultiFilter extends Component {
  constructor(props) {
    super(props);
    this.values = [];
    this.handleChange = this.handleChange.bind(this);
    this.createFilter = this.createFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);

    this.state = { numFilters: 1 };
    // this.setState({ numFilters: 1 });

    this.width = "150px";
  }

  handleChange(i, value) {
    this.values[i] = +value;
    this.props.onChange(this.values);
  }

  createFilter() {
    this.setState({ numFilters: this.state.numFilters + 1 });
  }

  resetFilter() {
    this.setState({ numFilters: 1 });
  }

  //render contains the layout of elements in the window of this plot
  //includes dropdowns, buttons, and other user interface
  render() {
    return (
      <div>
        <Button onClick={this.createFilter}>
          <span className="fas fa-plus"></span>
        </Button>
        <Button onClick={this.resetFilter}>
          <span className="fas fa-minus"></span>
        </Button>
        {Array(this.state.numFilters).fill(
          <Filter onChange={this.handleChange} />
        )}
      </div>
    );
  }
}

export default MultiFilter;
