import React, { Component } from "react";
import "./BoxPlot.css";

import boxPlot from "./box";
import { Dropdown, Checkbox } from "semantic-ui-react";
import YearSlider from "../../components/YearSlider/YearSlider";
/* The class to draw the Box Plot using the methods from box.js*/
class RawData extends Component {
  constructor() {
    super();
    this.state = { keys: [], data: [], outliers: false };

    this.setParam = this.setParam.bind(this);
    this.setOutliers = this.setOutliers.bind(this);
    this.toggleScale = this.toggleScale.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDateFilter = this.handleDateFilter.bind(this);
  }

  componentDidMount() {
    this.box = new boxPlot();
    this.box.clear();
    this.box.buildAxes();

    fetch("/streams")
      .then(response => response.json())
      .then(result => {
        var variables = Object.keys(result[0]);
        //remove variables that we do not want the ability to graph
        //WSID is just an ID so the graph is not very useful
        //ecoli method is the method which which ecoli info was collected
        //a box plot of date is not important
        variables.splice(variables.indexOf("WS"), 1);
        variables.splice(variables.indexOf("ID"), 1);
        variables.splice(variables.indexOf("ecoli_method"), 1);
        variables.splice(variables.indexOf("date"), 1);

        var WSs = result.map(row => row.WS);
        WSs = [...new Set(WSs)];
        WSs = WSs.map(id => ({ key: id, text: id, value: id }));

        this.setState({ keys: variables, data: result, WSs: WSs });
        this.state.data.forEach(d => (d.date = new Date(d.date)));
        this.setState({ outliers: false });

        this.box.data = this.state.data;
      });
  }

  setParam(event, data) {
    this.param = data.value;
    this.box.draw(this.param, this.state.outliers);
  }
  setOutliers() {
    this.setState({ outliers: !this.state.outliers }, () => {
      this.box.draw(this.param, this.state.outliers);
    });
  }

  toggleScale() {
    this.box.isLog = !this.box.isLog;
    this.box.draw(this.param);
  }

  handleSearch(_, data) {
    this.box.WSs = data.value;
    this.box.draw(this.param);
  }

  handleDateFilter(data) {
    this.box.yearRange = data;
    this.box.draw(this.param);
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
            label="Display Outliers"
            onChange={this.setOutliers}
          />
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

export default RawData;
