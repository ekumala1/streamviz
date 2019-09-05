import React, { Component } from "react";
import { Button, Table, Pagination } from "semantic-ui-react";

import "./RawData.css";

class RawData extends Component {
  PAGE_SIZE = 30;

  constructor(props) {
    super(props);
    this.state = { numPages: 0 };
    this.updatePage = this.updatePage.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:5000/streams")
      .then(response => response.json())
      .then(result => {
        this.setState({
          data: result,
          numPages: Math.floor(result.length / this.PAGE_SIZE)
        });
        // this.setState({ filteredData: this.state.data });
        this.setState({ fData: this.state.data.slice(0, this.PAGE_SIZE) });
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

  updatePage(e, { activePage }) {
    activePage--;

    this.setState({
      fData: this.state.data.slice(
        activePage * this.PAGE_SIZE,
        (activePage + 1) * this.PAGE_SIZE
      )
    });
    console.log(this.state);
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
        <Pagination
          defaultActivePage={1}
          totalPages={this.state.numPages}
          onPageChange={this.updatePage}
        />
      </div>
    );
  }
}

export default RawData;
