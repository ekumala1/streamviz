import React, { Component } from "react";
import "./TimeSeries.css";

import timePlot from "./time";
import { Dropdown } from "semantic-ui-react";

class TimeSeries extends Component {
  params = [];

  constructor() {
    super();
    this.state = { keys: [], data: [] };
  }

  componentDidMount() {
    this.time = new timePlot();
    this.time.clear();

    fetch("http://localhost:5000/streams")
      .then(response => response.json())
      .then(result => {
        var variables = Object.keys(result[0]);
        variables.splice(variables.indexOf("WSID"), 1);
        variables.splice(variables.indexOf("ecoli_method"), 1);
        variables.splice(variables.indexOf("date"), 1);
        this.setState({ keys: variables, data: result });
        this.state.data.forEach(
          d => (d.date = d.date == null ? null : new Date(d.date))
        );

        this.time.data = this.state.data;
        this.time.buildAxes();
      });
  }

  setParam(event, data) {
    this.params[0] = data.value;
    console.log(this.params);

    this.time.buildLinePlot(this.params);
  }

  render() {
    var options = this.state.keys.map(key => {
      return { key: key, text: key, value: key };
    });

    return (
      <div className="container">
        <div className="sidebar">
          <h2>choices</h2>
          <p>Variable:</p>
          <Dropdown
            placeholder="Variables"
            fluid
            multiple
            selection
            options={options}
            onChange={this.setParam.bind(this)}
          />
        </div>
        <div className="content">
          <svg id="svg" width="1195.5px" height="100%" />
        </div>
      </div>
    );
  }
}

export default TimeSeries;
