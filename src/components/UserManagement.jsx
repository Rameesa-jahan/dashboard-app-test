/* eslint-disable react/jsx-key */

import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Spin, Row, Col, Space } from 'antd';
import jsPDF from 'jspdf';
import Title from 'antd/es/typography/Title';

const { Search } = Input;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
                setFilteredUsers(data);
                setLoading(false); 
            });
    }, []);

    const onSearch = (value) => {
        const filtered = users.filter((user) =>
            user?.name.toLowerCase().includes(value.toLowerCase()) ||
            user?.company?.name.toLowerCase().includes(value.toLowerCase()) ||
            user?.address?.city.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('User List', 10, 10);
        users.forEach((user, index) => {
            doc.text(`${index + 1}. ${user.name} - ${user.company.name} - ${user.address.city}`, 10, 20 + index * 10);
        });
        doc.save('users.pdf');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Company', dataIndex: ['company', 'name'], key: 'company' },
        { title: 'City', dataIndex: ['address', 'city'], key: 'city' },
    ];

    return (
        <Space direction='vertical' style={{ width: '100%' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                <Col>
                    <Title style={{ margin: 0 }} level={4}>User Management</Title>
                </Col>
                <Col>
                    <Button disabled={loading} type="primary" onClick={downloadPDF}>Download PDF</Button>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Search
                        allowClear
                        placeholder="Search by name, company, or city"
                        onSearch={onSearch}
                        style={{ marginBottom: '16px' }}
                    />
                </Col>
            </Row>

            {loading ? (
                <Row justify="center" align="middle" style={{ height: '300px' }}>
                    <Col>
                        <Spin tip="Loading..." size="small" />
                    </Col>
                </Row>
            ) : (
                <Table dataSource={filteredUsers} columns={columns} rowKey="id" />
            )}
        </Space>
    );
};

export default UserManagement;
