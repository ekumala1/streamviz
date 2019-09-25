import React, { Component } from "react";
import { Button, Dropdown } from "semantic-ui-react";

import "./RawData.css";

class RawData extends Component {
  PAGE_SIZE = 16;

  constructor(props) {
    super(props);
    // column and direction are for sorting
    this.state = { numPages: 0, page: 1, column: null, direction: true };
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:5000/streams")
      .then(response => response.json())
      .then(result => {
        var WSIDs = result.map(row => row.WSID);
        WSIDs = [...new Set(WSIDs)];
        WSIDs = WSIDs.map(id => ({ key: id, text: id, value: id }));

        this.setState({
          data: result,
          fData: result,
          WSIDs: WSIDs,
          numPages: Math.ceil(result.length / this.PAGE_SIZE)
        });
      });
  }

  componentDidUpdate() {
    // let table = "";
    // table += "<tr>";
    // for (var key in this.state.data[0]) table += `<th>${key}</th>`;
    // table += "</tr>";
    // for (var row of this.state.data) {
    //   table += "<tr>";
    //   for (key in row) table += `<td>${row[key]}</td>`;
    //   table += "</tr>";
    // }
    // this.refs.raw.innerHTML += table;
  }

  getFile() {
    console.log("hi");

    fetch("http://localhost:5000/streams/download")
      .then(response => response.blob())
      .then(result => {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.csv");
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  }

  handleSort(column) {
    if (column !== this.state.column) {
      var data = this.state.fData;
      data.sort((a, b) => a[column] - b[column]);

      this.setState({
        fData: data,
        column: column,
        ascending: true
      });
    } else {
      this.setState({
        fData: this.state.data.reverse(),
        ascending: !this.state.ascending
      });
    }
  }

  handleSearch(event, data) {
    if (!data.value.length) {
      this.setState({
        fData: this.state.data,
        numPages: Math.ceil(this.state.data.length / this.PAGE_SIZE)
      });
    } else {
      var filteredData = this.state.data.filter(row =>
        data.value.includes(row.WSID)
      );
      this.setState({
        fData: filteredData,
        numPages: Math.ceil(filteredData.length / this.PAGE_SIZE)
      });
    }
  }

  render() {
    return (
      <div style={{ overflow: "auto", height: "100%" }}>
        <div className="hangRight">
          <Button onClick={this.getFile}>Download</Button>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <span style={{ marginRight: "10px" }}>Show:</span>
          <Dropdown
            placeholder="WSID"
            multiple
            search
            selection
            options={this.state.WSIDs}
            onChange={this.handleSearch.bind(this)}
          />
        </div>
        <table>
          <tbody>
            <tr>
              {this.state.fData &&
                Object.keys(this.state.fData[0]).map(value => (
                  <th onClick={() => this.handleSort(value)}>{value}</th>
                ))}
            </tr>
            {this.state.fData &&
              this.state.fData.map(row => (
                <tr>
                  {Object.values(row).map(value => (
                    <td>{value}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default RawData;
