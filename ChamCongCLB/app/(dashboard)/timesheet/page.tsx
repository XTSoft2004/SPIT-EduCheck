'use client'
import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Button, Space, Form } from 'antd';
import DataGrid from '@/components/ui/Table/DataGrid';

import { getTimesheets, updateTimesheet, createTimesheet } from '@/actions/timesheet.actions';
import { getStudents } from '@/actions/student.actions';
import { getClasses } from '@/actions/class.actions';

import { ITimesheet, ITimesheetUpdate, ITimesheetCreate } from '@/types/timesheet';
import { IStudent } from '@/types/student';
import { IClass } from '@/types/class';

import CustomModal from '@/components/Modal/CustomModal';
import SpinLoading from '@/components/ui/Loading/SpinLoading';
import Searchbar from '@/components/ui/Table/Searchbar';
import { CirclePlus, CircleX } from 'lucide-react'
import { EditOutlined } from '@ant-design/icons';

import { Role, useAuth } from '@/context/AuthContext';
import { ButtonAddTable } from '@/components/ui/Button/ButtonAddTable';

import FormTimesheetAdd from './FormTimesheetAdd';
import FormTimesheetUpdate from './FormTimesheetUpdate';

export default function ClassPage() {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [isLoad, setIsLoad] = useState(true);

    const { role } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, classesData] = await Promise.all([
                    getStudents(),
                    getClasses(),
                ]);
                setStudents(studentsData.data);
                setClasses(classesData.data);
            }
            finally {
                setIsLoad(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        {
            title: 'Lớp học',
            dataIndex: 'classId',
            key: 'classId',
            render: (classId: number) => {
                const className = classes.find(c => c.id === classId);
                return className ? `${className.name}` : 'Không xác định';
            }
        },
        {
            title: 'Ngày điểm danh',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => {
                const dateObj = new Date(date);
                const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return dateObj.toLocaleDateString('vi-VN', options);
            }
        },
        {
            title: 'Buổi',
            dataIndex: 'timeId',
            key: 'timeId',
            render: (timeId: number) => {
                switch (timeId) {
                    case 1:
                        return 'Sáng';
                    case 2:
                        return 'Chiều';
                    case 3:
                        return 'Tối';
                    default:
                        return 'Không xác định';
                }
            }
        },
        {
            title: 'Danh sách sinh viên',
            dataIndex: 'studentsId',
            key: 'studentsId',
            render: (studentsId: number[]) => {
                const studentNames = studentsId
                    .map(id => {
                        const student = students.find(s => s.id === id);
                        return student ? `${student.lastName} ${student.firstName}` : 'Không xác định';
                    })
                    .join(', ');
                return studentNames.length > 20 ? `${studentNames.slice(0, 20)}...` : studentNames;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Hình ảnh điểm danh',
            dataIndex: 'imageBase64',
            key: 'imageBase64',
            render: (imageBase64: string) => {
                return imageBase64 ? (
                    <img
                        // src={`http://xtcoder2004.io.vn:5000/extension/image?nameFile=${imageBase64}`}
                        src={imageBase64}
                        alt="Hình ảnh điểm danh"
                        style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                    />
                ) : (
                    <span>Không có hình ảnh</span>
                );
            }
        },
        {
            title: 'Chú thích',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) => note.length > 50 ? `${note.slice(0, 50)}...` : note,
        },
        ...(role === Role.ADMIN ? [
            {
                title: 'Hành động',
                key: 'action',
                render: (_: unknown, record: ITimesheet) => (
                    <Space>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    </Space>
                ),
            }
        ] : [])
    ];

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedTimesheet, setTimesheet] = useState<ITimesheet | null>(null);

    const [searchText, setSearchText] = useState('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    const { data, isLoading } = useSWR(
        ['timesheets', searchText, pageIndex, pageSize],
        ([, search, page, limit]) => getTimesheets(search, page, limit),
        { revalidateOnFocus: false }
    );

    const timesheets = data?.data || [];
    const totaltimesheets = data?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = (formData: ITimesheet) => {
        form.setFieldsValue({
            studentsId: formData.studentsId,
            classId: formData.classId,
            timeId: formData.timeId,
            date: formData.date,
            imageBase64: formData.imageBase64,
            status: formData.status,
            note: formData.note || '',
        });
        setIsModalOpen(true);
        setTimesheet(formData);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setIsModalCreate(false);
        form.resetFields();
    }

    const handleUpdate = async () => {
        try {
            const values = await form.getFieldsValue();

            const file = values.imageBase64?.[0]?.originFileObj;

            const imageBase64 = file ? await fileToBase64(file) : selectedTimesheet?.imageBase64;

            const formUpdate: ITimesheetUpdate = {
                id: selectedTimesheet?.id || 0,
                studentsId: values.studentsId,
                classId: values.classId,
                timeId: values.timeId,
                date: values.date,
                imageBase64: imageBase64,
                status: values.status,
                note: values.note || '',
            };

            const response = await updateTimesheet(formUpdate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setTimesheet(null);

                mutate(['timesheets', searchText, pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error updating timesheet:', error);
        }
    }

    const handleCreate = async () => {
        try {
            const values = await form.getFieldsValue();

            const file = values.imageBase64?.[0]?.originFileObj
            if (!file) {
                console.error("Chưa có file hợp lệ!")
                return
            }

            // Nếu file là File, chuyển nó thành Base64
            const imageBase64 = await fileToBase64(file)


            const formCreate: ITimesheetCreate = {
                studentsId: values.studentsId,
                classId: values.classId,
                timeId: values.timeId,
                date: values.date,
                imageBase64: imageBase64,
                status: 'Đang chờ duyệt',
                note: values.note || '',
            };
            const response = await createTimesheet(formCreate);
            if (response.ok) {
                setIsModalOpen(false);
                form.resetFields();
                setTimesheet(null);

                mutate(['timesheets', searchText, pageIndex, pageSize]);
            }
        }
        catch (error) {
            console.error('Error creating timesheet:', error);
        }
    }

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <ButtonAddTable
                    btnText="Thêm chấm công"
                    role={Role.ADMIN}
                    onClick={() => setIsModalCreate(true)}
                />
                <div className="flex justify-end w-full">
                    <Searchbar setSearchText={handleSearch} />
                </div>
            </div>

            {(isLoading || classes.length === 0 || students.length === 0) ? <SpinLoading /> : (
                <DataGrid<ITimesheet>
                    rowKey="id"
                    data={timesheets}
                    columns={columns}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalRecords={totaltimesheets}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}
                />
            )}

            <CustomModal
                isOpen={isModalCreate}
                onClose={handleClose}
                title="Thêm thông tin điểm danh"
                footer={
                    <Space>
                        <Button type="primary" onClick={handleCreate}>
                            <CirclePlus size={20} />Thêm điểm danh
                        </Button>
                        <Button type="default" onClick={handleClose}>
                            <CircleX size={20} />Đóng</Button>
                    </Space>
                }>
                <FormTimesheetAdd form={form} classes={classes} students={students} />
            </CustomModal>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Chỉnh sửa thông tin điểm danh"
                footer={
                    <Space>
                        <Button type="primary" onClick={() => selectedTimesheet && handleUpdate()}>Cập nhật</Button>
                        <Button type="default" onClick={handleClose}>Đóng</Button>
                    </Space>
                }>
                <FormTimesheetUpdate form={form} classes={classes} students={students} />
            </CustomModal>
        </>
    )
}