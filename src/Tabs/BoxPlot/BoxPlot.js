import React, { Component } from "react";
import "./BoxPlot.css";

import boxPlot from "./box";
import { Dropdown, Checkbox } from "semantic-ui-react";
/* The class to draw the Box Plot using the methods from box.js*/
class RawData extends Component {
  constructor() {
    super();
    this.state = { keys: [], data: [], outliers: false };

    this.setParam = this.setParam.bind(this);
    this.setOutliers = this.setOutliers.bind(this);
  }

  componentDidMount() {
    this.box = new boxPlot();
    this.box.clear();
    this.box.buildAxes();

    fetch("http://localhost:5000/streams")
      .then(response => response.json())
      .then(result => {
        var variables = Object.keys(result[0]);
        variables.splice(variables.indexOf("WSID"), 1);
        variables.splice(variables.indexOf("ecoli_method"), 1);
        variables.splice(variables.indexOf("date"), 1);
        this.setState({ keys: variables, data: result });
        this.state.data.forEach(d => (d.date = new Date(d.date)));
        this.setState({ outliers: false });
        console.log(this.state.data);

        this.box.data = this.state.data;
      });
  }

  setParam(event, data) {
    this.box.updateAxes(data.value);
    this.box.buildBox(this.state.outliers);
  }
  setOutliers() {
    this.setState({ outliers: !this.state.outliers }, () => {
      this.box.buildBox(this.state.outliers);
    });
  }

  render() {
    var options = this.state.keys.map(key => {
      return { key: key, text: key, value: key };
    });

    return (
      <div className="container">
        <div className="sidebar">
          <h2>Choose Data</h2>
          <p>Variable:</p>
          <Dropdown
            placeholder="Variable"
            fluid
            selection
            options={options}
            onChange={this.setParam}
          />
        </div>
        <div className="content">
          <svg id="svg" width="1195.5px" height="95%" />
          <br />
          <Checkbox
            toggle
            label="Display Outliers"
            onChange={this.setOutliers}
          />
        </div>
      </div>
    );
  }
}

export default RawData;
