import React from 'react';
import { Modal, Button, Card, Table, Menu, Dropdown } from 'antd';
import Title from 'antd/es/typography/Title';
import { MoreOutlined } from '@ant-design/icons';
import { geodesicDistance } from '../distanceUtils';

const MissionModal = ({ visible, waypoints, onClose, onInsertPolygonBefore, onInsertPolygonAfter }) => {
    const hasWaypoints = waypoints && waypoints.length > 0;

    const columns = [
        {
            title: "Waypoint",
            dataIndex: "waypoint",
            key: "waypoint",
            render: (text) => `WP(${text.toString().padStart(2, '0')})`,
        },
        {
            title: "Coordinates",
            dataIndex: "coordinates",
            key: "coordinates",
            render: (coords) => `(${coords[0].toFixed(6)}, ${coords[1].toFixed(6)})`,
        },
        {
            title: "Distance (km)",
            dataIndex: "distance",
            key: "distance",
            render: (text, record, index) => {
                if (index === 0) return "0.000";
                const prevCoords = waypoints[index - 1];
                const currCoords = record.coordinates;
                const distance = geodesicDistance(prevCoords, currCoords);
                return distance.toFixed(3); 
            }
        },
        {
            title: "More Actions",
            key: "actions",
            render: (_, record) => (
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item key="insertBefore" onClick={() => onInsertPolygonBefore(record.key)}>
                            Insert Polygon Before
                        </Menu.Item>
                        <Menu.Item key="insertAfter" onClick={() => onInsertPolygonAfter(record.key)}>
                            Insert Polygon After
                        </Menu.Item>
                    </Menu>
                }>
                    <Button icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    const data = waypoints.map((item, index) => ({
        key: index,
        waypoint: index,
        coordinates: item,
    }));

    return (
        <Modal
            title="Mission Creation"
            open={visible}
            onCancel={onClose}
            // maskClosable={false}
            mask={false}
            footer={
                <Button type="primary" disabled={!hasWaypoints}>
                    Generate Data
                </Button>
            }
            style={{ top: 20, left: 30, position: 'absolute' }}
        >
            {hasWaypoints ? (
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            console.log(selectedRowKeys, selectedRows);
                        },
                    }}
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    rowKey="key"
                    bordered
                />
            ) : (
                <p>No waypoints added yet.</p>
            )}

            <Card>
                <Title level={5}>Waypoint Navigation</Title>
                <Card style={{ border: '1px dashed #d9d9d9' }}>
                    <p>
                        Click on the map to mark points of the route and then press <b>Enter</b> to complete
                        the route.
                    </p>
                </Card>
            </Card>
        </Modal>
    );
};

export default MissionModal;
