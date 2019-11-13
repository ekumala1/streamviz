import React, { Component } from "react";
import "./TimeSeries.css";

import timePlot from "./time";
import { Dropdown } from "semantic-ui-react";
import { DateRangePicker } from "react-dates";
/* The class to draw the timeseries plot using the methods from
time.js */
class TimeSeries extends Component {
  params = [];

  constructor() {
    super();
    this.state = { keys: [], data: [] };

    this.setParam = this.setParam.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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
        variables.splice(variables.indexOf("WSID"), 1);
        variables.splice(variables.indexOf("ecoli_method"), 1);
        variables.splice(variables.indexOf("date"), 1);

        var WSIDs = result.map(row => row.WSID);
        WSIDs = [...new Set(WSIDs)];
        WSIDs = WSIDs.map(id => ({ key: id, text: id, value: id }));

        this.setState({ keys: variables, WSIDs: WSIDs });

        result.forEach(
          d => (d.date = d.date == null ? null : new Date(d.date))
        );
        this.time.data = result;
        this.time.buildAxes();
      });
  }

  setParam(event, data) {
    this.params[0] = data.value;
    console.log(this.params);

    this.time.buildLinePlot(this.params);
  }

  handleSearch(event, data) {
    this.time.WSIDs = data.value;
    this.time.buildLinePlot(this.params);
  }

  // if id is 0, start date
  // if ~~~~~ 1, end date
  handleRange(id, data) {}

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
          <Dropdown
            placeholder="WSID"
            multiple
            search
            selection
            options={this.state.WSIDs}
            onChange={this.handleSearch}
          />
          <p>Date range:</p>
          <DateRangePicker
            startDate={this.state.startDate} // momentPropTypes.momentObj or null,
            startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
            endDate={this.state.endDate} // momentPropTypes.momentObj or null,
            endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
            onDatesChange={({ startDate, endDate }) =>
              this.setState({ startDate, endDate })
            } // PropTypes.func.isRequired,
            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
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
