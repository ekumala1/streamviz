import React, { Component } from "react";
import "./TimeSeries.css";
import YearSlider from "../../components/YearSlider/YearSlider";

import timePlot from "./time";
import { Dropdown } from "semantic-ui-react";

/* The class to draw the timeseries plot using the methods from
time.js */
class TimeSeries extends Component {
  params = [];

  constructor() {
    super();
    this.state = { keys: [], data: [] };

    this.setParam = this.setParam.bind(this);
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
        variables.splice(variables.indexOf("E.coli Method"), 1);
        variables.splice(variables.indexOf("date"), 1);

        console.log(result);

        var WSIDs = result.map(row => row.WSID);
        WSIDs = [...new Set(WSIDs)];
        WSIDs = WSIDs.map(id => ({ key: id, value: id, name: id }));

        this.setState({ keys: variables, WSIDs: WSIDs });

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

  handleSearch(_, data) {
    this.time.WSIDs = data.value;
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
          {this.state.WSIDs && (
            <Dropdown
              placeholder="WSID"
              multiple
              search
              selection
              options={this.state.WSIDs}
              onChange={this.handleSearch}
            />
          )}
          <p>Date range:</p>
          <YearSlider onChange={this.handleDateFilter}></YearSlider>
        </div>
        <div className="content">
          <svg id="svg" width="1195.5px" height="100%" />
        </div>
      </div>
    );
  }
}

export default TimeSeries;
