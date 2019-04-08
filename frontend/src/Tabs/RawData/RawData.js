import React, { Component } from 'react';

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

  componentDidUpdate() {
    let table = '';

    table += '<tr>';
    for (var key in this.state.data[0]) table += `<th>${key}</th>`;
    table += '</tr>';

    for (var row of this.state.data) {
      table += '<tr>';
      for (key in row) table += `<td>${row[key]}</td>`;
      table += '</tr>';
    }

    this.refs.raw.innerHTML += table;
  }

  render() {
    return (
      <div>
        <table>
          <tbody ref="raw" />
        </table>
      </div>
    );
  }
}

export default RawData;
