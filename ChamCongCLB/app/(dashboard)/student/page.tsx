'use client'
import { Button, Space, Form, Input, DatePicker, Select, Pagination } from 'antd';
const { Option } = Select;
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import DataGrid from '@/components/ui/Table/DataGrid';
import { getStudents } from '@/actions/student.actions';
import { IStudent } from '@/types/student';
import CustomModal from '@/components/Modal/CustomModal';
import dayjs from 'dayjs';
import FormStudent from './FormStudent';

export default function UserPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 1; // Số sinh viên trên mỗi trang

    // Gọi API sử dụng SWR
    const { data, error, isLoading } = useSWR(
        ['students', pageIndex, pageSize],
        ([, page, limit]) => getStudents(page, limit) // Không cần `await`, vì SWR tự xử lý Promise
    );

    const students = data?.data || [];
    const totalStudents = data?.total || 0;
    useEffect(() => {
        console.log('Data:', data);
    }, [data]);
    // Xử lý mở modal
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    };

    const handleClose = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    // Cột của bảng
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
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (value: boolean) => (value ? 'Nam' : 'Nữ'),
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
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: IStudent) => (
                <Space>
                    <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
                </Space>
            ),
        }
    ];

    return (
        <>
            {isLoading ? <p>Đang tải dữ liệu...</p> : (
                <>
                    <DataGrid<IStudent> data={students} columns={columns} rowKey="id" />
                    <Pagination
                        className='flex flex-row justify-end mt-5'
                        current={pageIndex}
                        pageSize={pageSize}
                        total={totalStudents}
                        onChange={(page) => setPageIndex(page)}
                    />
                </>
            )}

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin sinh viên"
                footer={
                    <Space>
                        <Button type="primary">Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                {/* Form chứa thông tin của sinh viên */}
                <FormStudent form={form} />
            </CustomModal >
        </>
    );
}
