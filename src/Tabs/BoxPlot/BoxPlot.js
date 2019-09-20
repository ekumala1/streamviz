import React, { Component } from "react";
import "./BoxPlot.css";

import boxPlot from "./box";
import { Dropdown } from "semantic-ui-react";

class RawData extends Component {
  constructor() {
    super();
    this.state = { keys: [], data: [] };
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
        console.log(this.state.data);

        this.box.data = this.state.data;
      });
  }

  setParam(event, data) {
    this.box.buildBox(data.value);
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

export default RawData;
