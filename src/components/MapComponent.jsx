import React, { useRef, useEffect, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Draw } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

const MapComponent = ({
  setWaypoints,
  drawMode,
  insertMode,
  insertIndex,
  onInsertPolygonEnd,
}) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [vectorSource] = useState(new VectorSource());
  const [drawInteraction, setDrawInteraction] = useState(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    setMapInstance(map);

    return () => map.setTarget(null);
  }, [vectorSource]);

  useEffect(() => {
    if (!mapInstance) return;

    mapInstance.getInteractions().clear();

    if (drawMode || insertMode) {
      const interactionType = insertMode ? "Polygon" : drawMode;
      const newDrawInteraction = new Draw({
        source: vectorSource,
        type: interactionType,
      });

      setDrawInteraction(newDrawInteraction);

      mapInstance.addInteraction(newDrawInteraction);

      newDrawInteraction.on("drawend", (event) => {
        const geojson = new GeoJSON().writeFeature(event.feature);
        const geometry = event.feature.getGeometry();
        const coords = geometry.getCoordinates();

        if (insertMode) {
          onInsertPolygonEnd(coords, insertIndex);
        } else {
          setWaypoints(coords);
        }

        console.log("GeoJSON:", geojson);
      });
    }
  }, [drawMode, insertMode, mapInstance, vectorSource, setWaypoints, onInsertPolygonEnd, insertIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && drawInteraction) {
        drawInteraction.finishDrawing();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawInteraction]);

  return <div ref={mapRef} style={{ width: "100%", height: "90vh" }} />;
};

export default MapComponent;
