'use client'
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Button, Space, Form, message } from 'antd';
import DataGrid from '@/components/ui/Table/DataGrid';

import { ISemester, ISemesterCreate, ISemesterUpdate } from '@/types/semester';

import { getSemesters, updateSemester, createSemester } from '@/actions/semester.actions';

import CustomModal from '@/components/Modal/CustomModal';
import FormSemester from './FormSemester';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';
import { ButtonAddTable } from '@/components/ui/Button/ButtonAddTable';
import { Role, useAuth } from '@/context/AuthContext';
import { text } from 'stream/consumers';

export default function SemesterPage() {
    const { role } = useAuth();
    const columns = [
        {
            title: 'Năm bắt đầu',
            dataIndex: 'yearStart',
            key: 'yearStart',
        },
        {
            title: 'Năm kết thúc',
            dataIndex: 'yearEnd',
            key: 'yearEnd',
        },
        {
            title: 'Học kỳ',
            dataIndex: 'semesters_Number',
            key: 'semesters_Number',
        },
        ...(role === Role.ADMIN ? [
            {
                title: 'Hành động',
                key: 'action',
                render: (_: unknown, record: ISemester) => (
                    <Space>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    </Space>
                ),
            }
        ] : [])
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedCourse, setSelectedCourse] = useState<ISemester | null>(null);

    const [searchText, setSearchText] = useState('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    const { data, isLoading } = useSWR(
        ['semesters', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getSemesters(search, page, limit),
        { revalidateOnFocus: false }
    );

    const semesters = data?.data || [];
    const totalCourses = data?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = (formData: ISemester) => {
        form.setFieldsValue({
            semesters_Number: formData.semesters_Number,
            yearStart: formData.yearStart,
            yearEnd: formData.yearEnd,
        });
        setIsModalOpen(true);
        setSelectedCourse(formData);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setIsModalCreate(false);
        form.resetFields();
    }

    const handleUpdate = async () => {
        try {
            const values = await form.getFieldsValue();
            const formUpdate: ISemesterUpdate = {
                id: selectedCourse?.id || 0,
                semesters_Number: values.semesters_Number,
                yearStart: values.yearStart,
                yearEnd: values.yearEnd,
            };

            const response = await updateSemester(formUpdate);
            if (response.ok) {
                handleClose();
                setSelectedCourse(null);

                mutate(['semesters', searchText, pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error updating semester:', error);
        }
    }

    const handleCreate = async () => {
        try {
            const values = await form.getFieldsValue();
            const formCreate: ISemesterCreate = {
                semesters_Number: values.semesters_Number,
                yearStart: values.yearStart,
                yearEnd: values.yearEnd,
            };

            const response = await createSemester(formCreate);
            if (response.status === 200) {
                handleClose();
                setSelectedCourse(null);

                mutate(['semesters', searchText, pageIndex, pageSize]);
                message.success({ content: response.message });
                // <MessageAlert type='success' content={response.message} />
            } else {
                // <MessageAlert type='error' content={response.message} />
                message.error({ content: response.message });
            }
        }
        catch (error) {
            console.error('Error creating semester:', error);
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <ButtonAddTable
                    btnText="Thêm học kỳ"
                    role={role}
                    onClick={() => setIsModalCreate(true)}
                />
                <div className="flex justify-end w-full">
                    <Searchbar setSearchText={handleSearch} />
                </div>
            </div>

            {isLoading ? <SpinLoading /> : (
                <>
                    <DataGrid<ISemester>
                        rowKey="id"
                        data={semesters}
                        columns={columns}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalRecords={totalCourses}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize} />
                </>
            )}

            <CustomModal
                isOpen={isModalCreate}
                onClose={handleClose}
                title="Thêm thông tin học kỳ"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>
                            <CirclePlus size={20} />Thêm học kỳ
                        </Button>
                        <Button type="default" onClick={handleClose}>
                            <CircleX size={20} />Đóng</Button>
                    </Space>
                }>
                <FormSemester form={form} />
            </CustomModal>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin học kỳ"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedCourse && handleUpdate()}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                <FormSemester form={form} />
            </CustomModal>
        </>
    )
}