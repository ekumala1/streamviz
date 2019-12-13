import React, { Component } from "react";

import "./Upload.css";
import { Button } from "semantic-ui-react";

class Upload extends Component {
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  constructor() {
    super();
    this.upload = this.upload.bind(this);
    this.setFile = this.setFile.bind(this);

    this.state = {};
  }

  setFile(event) {
    this.setState({ file: event.target.files[0] });
  }

  upload() {
    const { file } = this.state;
    const data = new FormData();
    data.append("file", file);

    fetch("streams/upload", {
      method: "POST",
      body: data
    })
      .then(response => response.text())
      .then(result => {
        console.log(result);
      });
  }

  render() {
    return (
      <div className="container">
        <div className="card">
          <h1>Upload</h1>
          <input
            type="file"
            id="file"
            name="file"
            accept=".csv"
            onChange={this.setFile}
          ></input>
          <br></br>
          <Button onClick={this.upload}>Upload</Button>
        </div>
      </div>
    );
  }
}

export default Upload;
