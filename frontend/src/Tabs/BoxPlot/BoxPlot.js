import React, { Component } from 'react';
import './BoxPlot.css';

class RawData extends Component {
  componentDidMount() {
    fetch('http://localhost:5000/streams')
      .then(response => response.json())
      .then(result => {
        this.setState({ data: result });
        this.state.data.forEach(d => (d.Date = new Date(d.Date)));
        console.log(this.state.data);
      });
  }

  render() {
    return (
      <div class="container">
        <div class="sidebar">
          <h2>choices</h2>
          <p>Variable:</p>
        </div>
        <div class="content">
          <svg id="boxsvg" width="1195.5px" height="100%" />
        </div>
      </div>
    );
  }
}

export default RawData;
