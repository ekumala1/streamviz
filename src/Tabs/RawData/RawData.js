import React, { Component } from "react";
import { Button, Table, Pagination } from "semantic-ui-react";

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
        // this.setState({ filteredData: this.state.data });
        console.log(this.state);
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

  render() {
    return (
      <div>
        <div className="hangRight">
          <Button onClick={this.getFile}>Download</Button>
        </div>
        <table>
          <tbody>
            <tr>
              {this.state.data &&
                Object.keys(this.state.data[0]).map(value => <th>{value}</th>)}
            </tr>
            {this.state.data &&
              this.state.data.map(row => (
                <tr>
                  {Object.values(row).map(value => (
                    <td>{value}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination defaultActivePage={5} totalPages={10} />
      </div>
    );
  }
}

export default RawData;
