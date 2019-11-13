import React, { Component } from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import "./MapView.css";

//import mapView from "./map";
//import { Dropdown, Checkbox } from "semantic-ui-react";

//API Key:
//pk.eyJ1IjoiamNyYXdmb3JkNzIiLCJhIjoiY2sybmxhNDMxMDFyNDNpczc5dGthc242YSJ9.1CRWNCxw7Oqw6TXuwLDqpg
//tutorial: https://blog.cloudboost.io/adding-custom-maps-to-react-app-using-mapbox-bb978845e7ad
const TOKEN =
  "pk.eyJ1IjoiamNyYXdmb3JkNzIiLCJhIjoiY2sybmxhNDMxMDFyNDNpczc5dGthc242YSJ9.1CRWNCxw7Oqw6TXuwLDqpg";
const navStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px"
};
export default class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 37.785164,
        longitude: -100,
        zoom: 2.8,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500
      }
    };
  }
  render() {
    const { viewport } = this.state;
    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken={TOKEN}
      >
        <div className="nav" style={navStyle}>
          <NavigationControl />
        </div>
      </MapGL>
    );
  }
}
