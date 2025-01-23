/* eslint-disable react/jsx-key */

import React, { useEffect, useState } from 'react';
import { Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const DataVisualization = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/dummy.json')
            .then((response) => response.json())
            .then((data) => {
                const monthlySalesData = data.data.monthlySales.map((item) => ({
                    name: item.month,
                    value: item.sales,
                }));
                setData(monthlySalesData);
            })
            .catch((error) => console.error("Error loading the data:", error));
    }, []);

    return (
        <Space direction='vertical' style={{ width: '100%' }}>
            <Title level={4}>Data Visualization</Title>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <LineChart width={500} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>

                <BarChart width={500} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </div>
        </Space>
    );
};

export default DataVisualization;
