'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getUsers } from '@/actions/user.actions';
import { IUser } from '@/types/user';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import DataGrid from '@/components/ui/Table/DataGrid';
import useSWR from 'swr';
import { CirclePlus } from 'lucide-react';
import Searchbar from '@/components/ui/Table/Searchbar';
import { getClasses } from '@/actions/class.actions';
import SpinLoading from '@/components/ui/Loading/SpinLoading';

export default function PageUser() {


    // useEffect(() => {
    //     fetchUsers();
    // }, []);

    // const fetchUsers = async () => {
    //     const response = await getUsers();
    //     if (response.ok) {
    //         setUser(response.data);
    //     }
    // };

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
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
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
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [searchText, setSearchText] = useState('');
    // const [user, setUser] = useState<IUser[]>([]);

    const { data, isLoading } = useSWR(
        ['users', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getUsers(search, page, limit),
        { revalidateOnFocus: false }
    );
    const user = data?.data || [];
    const totalUsers = data?.total || 0;

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <Button
                    className="w-full md:w-auto flex items-center gap-2"
                    onClick={() => setIsModalCreate(true)}
                >
                    <CirclePlus size={20} />
                    Thêm sinh viên
                </Button>

                <Searchbar setSearchText={handleSearch} />
            </div>


            {isLoading ? <SpinLoading /> : (
                <>
                    <DataGrid<IUser>
                        rowKey="id"
                        data={user}
                        columns={columns}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalRecords={totalUsers}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize} />
                </>
            )}


        </>
    );
};