import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";

import "./RawData.css";

class RawData extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    fetch("http://localhost:5000/streams")
      .then(response => response.json())
      .then(result => {
        this.setState({ data: result });
        this.state.data.forEach(d => (d.date = new Date(d.date)));
      });
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

  render() {
    return (
      <div>
        <div className="hangRight">
          <Button onClick={this.getFile}>Download</Button>
        </div>
        <table>
          <tbody>
            <tr>
              {this.state.fData &&
                Object.keys(this.state.fData[0]).map(value => <th>{value}</th>)}
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
