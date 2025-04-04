'use client'
import { Button, Space, Form, TableProps, Table, Checkbox, TableColumnsType, Modal } from 'antd';
import React, { use, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataGrid from '@/components/ui/Table/DataGrid';
import { getUsers, changePassword, banUser, changePasswordByAdmin } from '@/actions/user.actions';
import { createAccount } from '@/actions/auth.actions';
import { IUser, IUserCreate, IUserChangePassword } from '@/types/user';
import CustomModal from '@/components/Modal/CustomModal';
import dayjs from 'dayjs';
import FormUser from './FormUser';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';

import { Role, useAuth } from '@/context/AuthContext';
import { ButtonAddTable } from '@/components/ui/Button/ButtonAddTable';

export default function UserPage() {
    const { role } = useAuth();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => {
            setSelectedRowKeys(keys);
        },
    };

    const columns: TableColumnsType<IUser> = [
        /*         {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    render: (value) => <strong>{value}</strong>,
                }, */
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
        ...(role === Role.ADMIN ? [
            {
                title: 'Hành động',
                key: 'action',
                render: (_: unknown, record: IUser) => (
                    <Space>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>

                        <Button
                            type="primary"
                            danger={!record.isLocked}
                            onClick={() => handleBan(record.id)}>
                            {record.isLocked ? 'Gỡ Ban' : 'Ban'}
                        </Button>
                    </Space >
                ),
            }
        ] : [])
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [searchText, setSearchText] = useState('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    const { data, isLoading } = useSWR(
        ['users', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getUsers(search, page, limit),
        { revalidateOnFocus: false }
    );

    const users = data?.data || [];
    const totalusers = data?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [form] = Form.useForm();

    const handleClose = () => {
        setIsModalOpen(false);
        setIsModalCreate(false);
        form.resetFields();
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const formCreate: IUserCreate = {
                username: values.username,
                password: values.password,
            };
            const response = await createAccount(formCreate);
            if (response.ok) {
                setIsModalCreate(false);
                form.resetFields();
                mutate(['users', searchText, pageIndex, pageSize]);
            }
        } catch (error) {
            console.error('Failed to create User:', error);
        }
    };

    const handleBan = async (idUser: number) => {
        try {
            Modal.confirm({
                title: 'Xác nhận',
                content: 'Bạn có chắc chắn muốn ban người dùng này?',
                okText: 'Đồng ý',
                cancelText: 'Hủy',
                onOk: async () => {
                    const response = await banUser(idUser);
                    if (response.ok) {
                        setSelectedRowKeys([]);
                        mutate(['users', searchText, pageIndex, pageSize]);
                    }
                },
            });
        } catch (error) {
            console.error('Failed to ban user:', error);
        }
    }

    const handleEdit = (user: IUser) => {
        form.setFieldsValue({
            id: user.id,
            passwordNew: '',
        });
        setIsModalOpen(true);
        setSelectedUser(user);
    }

    const handleUpdatePassword = async () => {
        try {
            const values = await form.validateFields();
            const formUpdate: IUserChangePassword = {
                userId: selectedUser?.id || 0,
                passwordNew: values.passwordNew,
            };
            const response = await changePasswordByAdmin(formUpdate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedUser(null);
                mutate(['users', searchText, pageIndex, pageSize]);
            }
        } catch (error) {
            console.error('Failed to update password:', error);
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <ButtonAddTable
                    btnText="Thêm người dùng"
                    role={role}
                    onClick={() => setIsModalCreate(true)}
                />
                <div className="flex justify-end w-full">
                    <Searchbar setSearchText={handleSearch} />
                </div>
            </div>

            {isLoading ? <SpinLoading /> : (
                <>
                    <DataGrid<IUser>
                        rowKey="id"
                        rowSelection={rowSelection}
                        data={users}
                        columns={columns}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalRecords={totalusers}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize} />
                </>
            )}

            <CustomModal
                isOpen={isModalCreate}
                onClose={handleClose}
                title="Thêm thông tin người dùng"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>
                            <CirclePlus size={20} />Thêm người dùng
                        </Button>
                        <Button type="default" onClick={handleClose}>
                            <CircleX size={20} />Đóng</Button>
                    </Space>
                }>
                <FormUser form={form} />
            </CustomModal>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin người dùng"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedUser && handleUpdatePassword()}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                <FormUser form={form} />
            </CustomModal>
        </>
    );
}
