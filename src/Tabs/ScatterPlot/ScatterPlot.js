import React, { Component } from "react";
import "./ScatterPlot.css";

import scatterPlot from "./scatter";
import { Dropdown, Checkbox } from "semantic-ui-react";

class RawData extends Component {
  params = [];

  constructor() {
    super();
    this.state = { keys: [], data: [] };
  }

  componentDidMount() {
    this.scatter = new scatterPlot();
    this.scatter.clear();
    this.scatter.buildAxes();

    fetch("http://localhost:5000/streams")
      .then(response => response.json())
      .then(result => {
        this.setState({ keys: Object.keys(result[0]), data: result });
        this.state.data.forEach(d => (d.date = new Date(d.date)));
        console.log(this.state.data);

        this.scatter.data = this.state.data;
      });
  }

  setParam1(event, data) {
    this.params[0] = data.value;
    console.log(this.params);

    if (this.params.length === 2) {
      this.scatter.buildScatter(this.params);
    }
  }

  setParam2(event, data) {
    this.params[1] = data.value;
    console.log(this.params);

    if (this.params.length === 2) {
      this.scatter.buildScatter(this.params);
    }
  }

  render() {
    var options = this.state.keys.map(key => {
      return { key: key, text: key, value: key };
    });

    return (
      <div className="container">
        <div className="sidebar">
          <h2>Choose Data</h2>
          <p>Variable 1:</p>
          <Dropdown
            placeholder="Variable"
            fluid
            selection
            options={options}
            onChange={this.setParam1.bind(this)}
          />
          <p>Variable 2:</p>
          <Dropdown
            placeholder="Variable"
            fluid
            selection
            options={options}
            onChange={this.setParam2.bind(this)}
          />
        </div>
        <div className="content">
          <svg id="svg" width="1195.5px" height="95%" />
          <br />
          <Checkbox toggle label="Show line of best fit" />
        </div>
      </div>
    );
  }
}

export default RawData;
