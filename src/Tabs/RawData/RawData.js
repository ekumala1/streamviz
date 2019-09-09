import React, { Component } from "react";
import { Button, Table, Pagination } from "semantic-ui-react";

import "./RawData.css";

class RawData extends Component {
  PAGE_SIZE = 30;

  constructor(props) {
    super(props);
    // column and direction are for sorting
    this.state = { numPages: 0, page: 1, column: null, direction: true };
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

        this.updatePage(null, { activePage: 1 });
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
  }

  handleSort(column) {
    if (column != this.state.column) {
      var data = this.state.data;
      data.sort((a, b) => a[column] - b[column]);

      this.setState(
        {
          data: data,
          column: column,
          ascending: true
        },
        () => this.updatePage(null, { activePage: this.state.page })
      );
    } else {
      this.setState(
        {
          data: this.state.data.reverse(),
          ascending: !this.state.ascending
        },
        () => this.updatePage(null, { activePage: this.state.page })
      );
    }
  }

  render() {
    var getString = ascending => (ascending ? "ascending" : "descending");
    return (
      <div>
        <div className="hangRight">
          <Button onClick={this.getFile}>Download</Button>
        </div>

        <Table sortable celled>
          <Table.Header>
            <Table.Row>
              {this.state.fData &&
                Object.keys(this.state.fData[0]).map(value => (
                  <Table.HeaderCell
                    sorted={
                      this.state.column === value
                        ? getString(this.state.ascending)
                        : null
                    }
                    onClick={() => this.handleSort(value)}
                  >
                    {value}
                  </Table.HeaderCell>
                ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.fData &&
              this.state.fData.map(row => (
                <Table.Row>
                  {Object.values(row).map(value => (
                    <Table.Cell>{value}</Table.Cell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>

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
