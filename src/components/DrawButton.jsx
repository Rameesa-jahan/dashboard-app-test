import React from 'react';
import { Button } from 'antd';

const DrawButton = ({ onDrawLineString, onDrawPolygon }) => {
    return (
        <div style={{ margin: '10px' }}>
            <Button type="primary" onClick={onDrawLineString} style={{ marginRight: '10px' }}>
                Draw LineString
            </Button>
            <Button type="primary" onClick={onDrawPolygon}>
                Draw Polygon
            </Button>
        </div>
    );
};

export default DrawButton;
