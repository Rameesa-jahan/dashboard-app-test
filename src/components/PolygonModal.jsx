import React from "react";
import { Modal, Button, Table } from "antd";

const PolygonModal = ({ visible, waypoints, onClose, onImportPoints }) => {
  const points = waypoints[0] || []; // Extract points from the nested array

  const calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Radius of the Earth in meters
    const lat1 = (coord1[1] * Math.PI) / 180;
    const lat2 = (coord2[1] * Math.PI) / 180;
    const deltaLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const deltaLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const tableData = points.map((item, index) => {
    const previousWaypoint = points[index - 1];
    const distance = previousWaypoint
      ? calculateDistance(previousWaypoint, item).toFixed(2)
      : 0;

    if (Array.isArray(item) && item.length === 2 && !isNaN(item[0]) && !isNaN(item[1])) {
      return {
        key: index,
        waypoint: `WP(${index})`,
        coordinates: `(${item[0].toFixed(6)}, ${item[1].toFixed(6)})`,
        distance: distance,
      };
    } else {
      return {
        key: index,
        waypoint: `WP(${index})`,
        coordinates: "Invalid coordinates",
        distance: "N/A",
      };
    }
  });

  const columns = [
    { title: "Waypoint", dataIndex: "waypoint", key: "waypoint" },
    { title: "Coordinates", dataIndex: "coordinates", key: "coordinates" },
    { title: "Distance (m)", dataIndex: "distance", key: "distance" },
  ];

  return (
    <Modal
      title="Polygon Modal"
      visible={visible}
      onCancel={onClose}
      maskClosable={false}
      footer={[
        <Button key="import" type="primary" onClick={() => onImportPoints(points)}>
          Import Points
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      style={{ top: 20, left: 30, position: "absolute" }}
    >
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={false}
        rowKey="key"
        bordered
      />
    </Modal>
  );
};

export default PolygonModal;
