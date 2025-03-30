import React from 'react';
import { Form, Input, Select } from "antd";
import { FormInstance } from "antd/es/form";

import { IStudent } from '@/types/student';
import { ILecturer } from '@/types/lecturer';

const { Option } = Select;

interface FormClassProps {
    form: FormInstance;
    students: IStudent[];
    lecturers: ILecturer[];
}

export default function FormClass({ form, students, lecturers }: FormClassProps) {
    const times = [2, 3, 4, 5, 6, 7];

    return (
        <Form form={form} layout="vertical">
            <Form.Item
                label="Mã lớp"
                name="code"
                rules={[{ required: true, message: 'Vui lòng nhập mã lớp!' }]}
            >
                <Input placeholder="VD: 2024-2025.2.TIN1083.001" />
            </Form.Item>
            <Form.Item
                label="Tên lớp"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
            >
                <Input placeholder="VD: Kỹ thuật lập trình - Nhóm 1" />
            </Form.Item>
            <Form.Item
                label="Buổi học"
                name="day"
                rules={[{ required: true, message: 'Vui lòng nhập buổi!' }]}
            >
                <Select placeholder="Chọn buổi">
                    {times.map((time) => (
                        <Option key={time} value={time}>
                            Thứ {time}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Thời gian bắt đầu"
                name="timeStart"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}
            >
                <Input type="time" />
            </Form.Item>
            <Form.Item
                label="Thời gian kết thúc"
                name="timeEnd"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}
            >
                <Input type="time" />
            </Form.Item>
            <Form.Item
                label="Giảng viên"
                name="lecturerId"
                rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
            >
                <Select placeholder="Chọn giảng viên">
                    {lecturers.map(lecturer => (
                        <Option key={lecturer.id} value={lecturer.id}>
                            {lecturer.fullName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Sinh viên"
                name="studentsId"
            >
                <Select mode="multiple" placeholder="Chọn sinh viên">
                    {students.map(student => (
                        <Option key={student.id} value={student.id}>
                            {student.lastName} {student.firstName} ({student.maSinhVien})
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
}
