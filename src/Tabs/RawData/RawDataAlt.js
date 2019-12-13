import React, { Component } from "react";
import { Button, Table, Pagination, Dropdown } from "semantic-ui-react";

import "./RawData.css";

class RawData extends Component {
  PAGE_SIZE = 16;

  constructor(props) {
    super(props);
    // column and direction are for sorting
    this.state = { numPages: 0, page: 1, column: null, direction: true };
    this.handleSort = this.handleSort.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }

  componentDidMount() {
    fetch("streams")
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

    fetch("streams/download")
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
    this.setState({ page: activePage });
    activePage--;

    console.log(
      this.state.fData.slice(
        activePage * this.PAGE_SIZE,
        (activePage + 1) * this.PAGE_SIZE
      )
    );
    this.setState({
      pData: this.state.fData.slice(
        activePage * this.PAGE_SIZE,
        (activePage + 1) * this.PAGE_SIZE
      )
    });
  }

  handleSort(column) {
    if (column !== this.state.column) {
      var data = this.state.fData;
      data.sort((a, b) => a[column] - b[column]);

      this.setState(
        {
          fData: data,
          column: column,
          ascending: true
        },
        () => this.updatePage(null, { activePage: this.state.page })
      );
    } else {
      this.setState(
        {
          fData: this.state.data.reverse(),
          ascending: !this.state.ascending
        },
        () => this.updatePage(null, { activePage: this.state.page })
      );
    }
  }

  handleSearch(event, data) {
    if (!data.value.length) {
      this.setState(
        {
          fData: this.state.data,
          numPages: Math.ceil(this.state.data.length / this.PAGE_SIZE)
        },
        () => this.updatePage(null, { activePage: this.state.page })
      );
    } else {
      var filteredData = this.state.data.filter(row =>
        data.value.includes(row.WSID)
      );
      this.setState(
        {
          fData: filteredData,
          numPages: Math.ceil(filteredData.length / this.PAGE_SIZE)
        },
        () => this.updatePage(null, { activePage: this.state.page })
      );
    }
  }

  render() {
    var getString = ascending => (ascending ? "ascending" : "descending");

    return (
      <div style={{ overflow: "auto" }}>
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
        <Table sortable celled style={{ margin: 0 }}>
          <Table.Header>
            <Table.Row>
              {this.state.pData &&
                Object.keys(this.state.pData[0]).map((value, id) => (
                  <Table.HeaderCell
                    key={id}
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
            {this.state.pData &&
              this.state.pData.map((row, id) => (
                <Table.Row key={id}>
                  {Object.values(row).map((value, id) => (
                    <Table.Cell key={id}>{value}</Table.Cell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>

        <Pagination
          defaultActivePage={1}
          totalPages={this.state.numPages}
          onPageChange={this.updatePage}
          style={{ marginTop: 10 }}
        />
      </div>
    );
  }
}

export default RawData;
