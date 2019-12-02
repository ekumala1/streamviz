import React, { Component } from "react";
import "./TimeSeries.css";
import YearSlider from "../../components/YearSlider/YearSlider";

import timePlot from "./time";
import { Dropdown, Checkbox } from "semantic-ui-react";

/* The class to draw the timeseries plot using the methods from
time.js */
class TimeSeries extends Component {
  params = [];

  constructor() {
    super();
    this.state = { keys: [], data: [] };

    this.setParam = this.setParam.bind(this);
    this.toggleScale = this.toggleScale.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDateFilter = this.handleDateFilter.bind(this);
  }

  componentDidMount() {
    this.time = new timePlot();
    this.time.clear();

    fetch("http://localhost:5000/streams")
      .then(response => response.json())
      .then(result => {
        var variables = Object.keys(result[0]);
        //remove variables that we do not want the ability to graph
        //WSID is just an ID so the graph is not very useful
        //ecoli method is the method which which ecoli info was collected
        //a timeseries plot of date is not important
        variables.splice(variables.indexOf("WS"), 1);
        variables.splice(variables.indexOf("ID"), 1);
        variables.splice(variables.indexOf("E.coli Method"), 1);
        variables.splice(variables.indexOf("date"), 1);

        var WSs = result.map(row => row.WS);
        WSs = [...new Set(WSs)];
        WSs = WSs.map(id => ({ key: id, text: id, value: id }));

        this.setState({ keys: variables, WSs: WSs });

        result.forEach(
          d => (d.date = d.date == null ? null : new Date(d.date))
        );
        this.time.data = result;
        this.time.buildAxes();
      });
  }

  setParam(_, data) {
    this.param = data.value;
    console.log(this.param);

    this.time.draw(this.param);
  }

  toggleScale() {
    this.time.isLog = !this.time.isLog;
    this.time.draw(this.param);
  }

  handleSearch(_, data) {
    this.time.WSs = data.value;
    this.time.draw(this.param);
  }

  handleDateFilter(data) {
    this.time.yearRange = data;
    this.time.draw(this.param);
  }

  //render contains the layout of elements in the window of this plot
  //includes dropdowns, buttons, and other user interface
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
          <p>Filter by site:</p>
          {this.state.WSs && (
            <Dropdown
              placeholder="WS"
              multiple
              search
              selection
              options={this.state.WSs}
              onChange={this.handleSearch}
            />
          )}
          <p>Date range:</p>
          <YearSlider onChange={this.handleDateFilter}></YearSlider>
        </div>
        <div className="content">
          <svg id="svg" width="1195.5px" height="95%" />
          <br />
          <Checkbox
            toggle
            label="Logarithmic scale"
            onChange={this.toggleScale}
          />
        </div>
      </div>
    );
  }
}

export default TimeSeries;
