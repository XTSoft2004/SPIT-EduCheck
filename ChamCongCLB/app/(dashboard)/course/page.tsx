'use client'
import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Button, Space, Form } from 'antd';
import DataGrid from '@/components/ui/Table/DataGrid';

import { ICourse, ICourseCreate, ICourseUpdate } from '@/types/course';
import { ISemester } from '@/types/semester';

import { getCourses, createCourse, updateCourse } from '@/actions/course.actions';
import { getSemesters } from '@/actions/semester.actions';

import CustomModal from '@/components/Modal/CustomModal';
import FormCourse from './FormCourse';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';
import { title } from 'process';

export default function ClassPage() {
    const [semesters, setSemesters] = useState<ISemester[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [semestersRes] = await Promise.all([
                getSemesters(),
            ]);

            if (semestersRes.ok) setSemesters(semestersRes.data);
        };

        fetchData();
    }, []);

    const columns = [
        {
            title: 'Mã học phần',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên học phần',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            key: 'credits',
        },
        {
            title: 'Học kỳ',
            dataIndex: 'semesterId',
            key: 'semesterId',
            render: (semesterId: number) => {
                const semester = semesters.find((sem) => sem.id === semesterId);
                return semester ? `${semester.yearStart} - ${semester.yearEnd}.${semester.semesters_Number}` : '';
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: ICourse) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                </Space>
            ),
        }
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

    const [searchText, setSearchText] = useState('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    const { data, isLoading } = useSWR(
        ['courses', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getCourses(search, page, limit),
        { revalidateOnFocus: false }
    );

    const courses = data?.data || [];
    const totalCourses = data?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = (formData: ICourse) => {
        form.setFieldsValue({
            code: formData.code,
            name: formData.name,
            credits: formData.credits,
            semesterId: formData.semesterId,
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
            const formUpdate: ICourseUpdate = {
                id: selectedCourse?.id || 0,
                code: values.code,
                name: values.name,
                credits: values.credits,
                semesterId: values.semesterId,
            };

            const response = await updateCourse(formUpdate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedCourse(null);

                mutate(['courses', searchText, pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error updating course:', error);
        }
    }

    const handleCreate = async () => {
        try {
            const values = await form.getFieldsValue();
            const formCreate: ICourseCreate = {
                code: values.code,
                name: values.name,
                credits: values.credits,
                semesterId: values.semesterId,
            };

            const response = await createCourse(formCreate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedCourse(null);

                mutate(['courses', searchText, pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error creating course:', error);
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <Button
                    className="w-full md:w-auto flex items-center gap-2"
                    onClick={() => setIsModalCreate(true)}
                >
                    <CirclePlus size={20} />
                    Thêm học phần
                </Button>

                <Searchbar setSearchText={handleSearch} />
            </div>

            {isLoading ? <SpinLoading /> : (
                <>
                    <DataGrid<ICourse>
                        rowKey="id"
                        data={courses}
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
                title="Thêm thông tin học phần"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>
                            <CirclePlus size={20} />Thêm học phần
                        </Button>
                        <Button type="default" onClick={handleClose}>
                            <CircleX size={20} />Đóng</Button>
                    </Space>
                }>
                <FormCourse form={form} semesters={semesters} />
            </CustomModal>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin học phần"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedCourse && handleUpdate()}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                <FormCourse form={form} semesters={semesters} />
            </CustomModal>
        </>
    )
}