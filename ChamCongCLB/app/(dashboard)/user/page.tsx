'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getUsers } from '@/actions/user.actions';
import { IUser } from '@/types/user';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import DataGrid from '@/components/ui/Table/DataGrid';

export default function PageUser() {
    const [user, setUser] = useState<IUser[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await getUsers();
        if (response.ok) {
            setUser(response.data);
        }
    };

    const columns: TableColumnsType<IUser> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (value) => <strong>{value}</strong>,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Tình trạng tài khoản',
            dataIndex: 'isLocked',
            key: 'isLocked',
            render: (value) => !!value ? 'Đã khóa' : 'Hoạt động',
        },
        {
            title: 'Xác thực tài khoản',
            dataIndex: 'isVerify',
            key: 'isVerify',
            render: (value) => !!value ? 'Đã xác thực' : 'Chưa xác thực',
        },
        {
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
        },
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
        <DataGrid<IUser>
            data={user}
            columns={columns}
            rowKey="id"
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalRecords={user.length}
            setPageIndex={setPageIndex}
        />
    );
};