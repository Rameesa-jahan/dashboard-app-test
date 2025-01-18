import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import DrawButton from "./components/DrawButton";
import MissionModal from "./components/MissionModal";
import PolygonModal from "./components/PolygonModal";

const App = () => {
    const [drawMode, setDrawMode] = useState(null);
    const [lineStringCoords, setLineStringCoords] = useState([]);
    const [polygonCoords, setPolygonCoords] = useState([]);
    const [isMissionModalVisible, setMissionModalVisible] = useState(false);
    const [isPolygonModalVisible, setPolygonModalVisible] = useState(false);
  
    const handleDrawLineString = () => {
      setDrawMode("LineString");
      setMissionModalVisible(true);
      setPolygonModalVisible(false); 
    };
  
    const handleDrawPolygon = () => {
      setDrawMode("Polygon");
      setMissionModalVisible(false);
      setPolygonModalVisible(true); 
    };
  
    const handleImportPolygonPoints = (points) => {
      setLineStringCoords(points);
      setPolygonModalVisible(false); 
      setMissionModalVisible(true); 
    };
  
    return (
      <>
        <DrawButton
          onDrawLineString={handleDrawLineString}
          onDrawPolygon={handleDrawPolygon}
        />
        <MapComponent
          setWaypoints={drawMode === "LineString" ? setLineStringCoords : setPolygonCoords}
          drawMode={drawMode}
        />
        <MissionModal
          visible={isMissionModalVisible}
          waypoints={lineStringCoords}
          onClose={() => setMissionModalVisible(false)}
        />
        <PolygonModal
          visible={isPolygonModalVisible}
          waypoints={polygonCoords}
          onClose={() => setPolygonModalVisible(false)}
          onImportPoints={handleImportPolygonPoints}
        />
      </>
    );
  };
 export default App  
