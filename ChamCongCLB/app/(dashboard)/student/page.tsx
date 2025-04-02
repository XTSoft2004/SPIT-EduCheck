'use client'
import { Button, Space, Form, TableProps, Table } from 'antd';
import React, { use, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataGrid from '@/components/ui/Table/DataGrid';
import { createStudent, getStudents, updateStudent } from '@/actions/student.actions';
import { IStudent, IStudentCreate, IStudentUpdate } from '@/types/student';
import CustomModal from '@/components/Modal/CustomModal';
import dayjs from 'dayjs';
import FormStudent from './FormStudent';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';
import AddStudentButton from '@/components/ui/Button/AddStudentButton';

export default function UserPage() {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => {
            setSelectedRowKeys(keys);
        },
    };

    const columns = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'maSinhVien',
            key: 'maSinhVien',
        },
        {
            title: 'Họ',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Tên',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
            key: 'class',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
            render: (value: Date) => {
                const date = new Date(value);
                return date.toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            },
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (value: boolean) => (value ? 'Nam' : 'Nữ'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: IStudent) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                </Space>
            ),
        }
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
    const [searchText, setSearchText] = useState('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    const { data, isLoading } = useSWR(
        ['students', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getStudents(search, page, limit),
        { revalidateOnFocus: false }
    );

    const students = data?.data || [];
    const totalStudents = data?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = (student: IStudent) => {
        form.setFieldsValue({
            maSinhVien: student.maSinhVien,
            lastName: student.lastName,
            firstName: student.firstName,
            class: student.class,
            phoneNumber: student.phoneNumber,
            email: student.email,
            dob: student.dob ? dayjs(student.dob) : null,
            gender: student.gender,
        });
        setIsModalOpen(true);
        setSelectedStudent(student);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setIsModalCreate(false);
        form.resetFields();
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const formUpdate: IStudentUpdate = {
                id: selectedStudent?.id,
                maSinhVien: values.maSinhVien,
                lastName: values.lastName,
                firstName: values.firstName,
                class: values.class,
                phoneNumber: values.phoneNumber,
                email: values.email,
                dob: values.dob.format("YYYY-MM-DD"),
                gender: values.gender,
            };
            const response = await updateStudent(formUpdate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedStudent(null);
                mutate(['students', searchText, pageIndex, pageSize]);
            }
        } catch (error) {
            console.error('Failed to update student:', error);
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const formCreate: IStudentCreate = {
                id: 0,
                maSinhVien: values.maSinhVien,
                lastName: values.lastName,
                firstName: values.firstName,
                class: values.class,
                phoneNumber: values.phoneNumber,
                email: values.email,
                dob: values.dob.format("YYYY-MM-DD"),
                gender: values.gender
            };
            const response = await createStudent(formCreate);
            if (response.ok) {
                setIsModalCreate(false);
                form.resetFields();
                mutate(['students', searchText, pageIndex, pageSize]);
            }
        } catch (error) {
            console.error('Failed to create student:', error);
        }
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

                <div className="flex justify-end w-full">
                    <AddStudentButton selectedKeys={selectedRowKeys} />
                </div>

                <Searchbar setSearchText={handleSearch} />
            </div>

            {isLoading ? <SpinLoading /> : (
                <>
                    <DataGrid<IStudent>
                        rowKey="maSinhVien"
                        rowSelection={rowSelection}
                        data={students}
                        columns={columns}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalRecords={totalStudents}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize} />
                </>
            )}

            <CustomModal
                isOpen={isModalCreate}
                onClose={handleClose}
                title="Thêm thông tin sinh viên"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>
                            <CirclePlus size={20} />Thêm sinh viên
                        </Button>
                        <Button type="default" onClick={handleClose}>
                            <CircleX size={20} />Đóng</Button>
                    </Space>
                }>
                <FormStudent form={form} />
            </CustomModal>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin sinh viên"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedStudent && handleUpdate()}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                <FormStudent form={form} />
            </CustomModal>
        </>
    );
}
