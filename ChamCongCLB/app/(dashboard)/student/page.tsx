'use client'
import { Button, Space, Form, Input, DatePicker, Select, Pagination } from 'antd';
const { Option } = Select;
import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import DataGrid from '@/components/ui/Table/DataGrid';
import { createStudent, getStudents, updateStudent } from '@/actions/student.actions';
import { IStudent, IStudentCreate, IStudentUpdate } from '@/types/student';
import CustomModal from '@/components/Modal/CustomModal';
import dayjs from 'dayjs';
import FormStudent from './FormStudent';
import SpinLoading from '@/components/ui/Loading/SpinLoading';

export default function UserPage() {
    // Cột của bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
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

    // Xử lý phân trang
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 15;
    const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

    // Gọi API sử dụng SWR
    const { data, error, isLoading } = useSWR(
        ['students', pageIndex, pageSize],
        ([, page, limit]) => getStudents(page, limit)
    );

    const students = data?.data || [];
    const totalStudents = data?.total || 0;

    const handleUpdate = async (student: IStudent) => {
        try {
            const values = await form.validateFields();
            const formUpdate: IStudentUpdate = {
                id: student.id,
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
                setIsModalOpen(false); // Đóng modal
                form.resetFields(); // Reset form
                setSelectedStudent(null);

                // Revalidate dữ liệu SWR
                mutate(['students', pageIndex, pageSize]);
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
                setIsModalCreate(false); // Đóng modal
                form.resetFields(); // Reset form

                // Revalidate dữ liệu SWR
                mutate(['students', pageIndex, pageSize]);
            }
        } catch (error) {
            console.error('Failed to create student:', error);
        }
    };

    // Xử lý mở modal
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
        setIsModalCreate(false);;
        form.resetFields();
    };


    return (
        <>
            {isLoading ? <SpinLoading /> : (
                <>
                    <div className='flex flex-row justify-end mb-4'>
                        <Button onClick={() => setIsModalCreate(true)}>Thêm sinh viên</Button>
                    </div>
                    <DataGrid<IStudent>
                        rowKey="id"
                        data={students}
                        columns={columns}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalPage={totalStudents}
                        setPageIndex={setPageIndex} />
                </>
            )}

            <CustomModal
                isOpen={isModalCreate}
                onClose={handleClose}
                title="Thêm thông tin sinh viên"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>Thêm sinh viên</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                {/* Form chứa thông tin của sinh viên */}
                <FormStudent form={form} />
            </CustomModal >

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin sinh viên"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedStudent && handleUpdate(selectedStudent)}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                {/* Form chứa thông tin của sinh viên */}
                <FormStudent form={form} />
            </CustomModal >
        </>
    );
}
