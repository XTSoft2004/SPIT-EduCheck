import React from 'react';
import { Form, Input, Select } from "antd";
import { FormInstance } from "antd/es/form";

import { IClass } from '@/types/class';
import { IStudent } from '@/types/student';

const { Option } = Select;

interface FormClassProps {
    form: FormInstance;
    classes: IClass[];
    students: IStudent[];
}

export default function FormClass({ form, classes, students }: FormClassProps) {
    const times = ['Sáng', 'Chiều', 'Tối'];
    return (
        <Form
            form={form}
            layout="vertical"
        >
            <Form.Item
                label="Lớp học"
                name="classId"
                rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
            >
                <Select placeholder="Chọn lớp học">
                    {classes.map(classItem => (
                        <Option key={classItem.id} value={classItem.id}>
                            {classItem.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Ngày điểm danh"
                name="date"
                rules={[{ required: true, message: 'Vui lòng chọn ngày điểm danh' }]}
            >
                <Input type="date" />
            </Form.Item>
            <Form.Item
                label="Buổi"
                name="timeId"
                rules={[{ required: true, message: 'Vui lòng chọn buổi' }]}
            >
                <Select>
                    {times.map((time, index) => (
                        <Option key={index + 1} value={index + 1}>
                            {time}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Danh sách sinh viên"
                name="studentsId"
                rules={[{ required: true, message: 'Vui lòng chọn danh sách sinh viên' }]}
            >
                <Select
                    mode="multiple" placeholder="Chọn sinh viên"
                >
                    {students.map(student => (
                        <Option key={student.id} value={student.id}>
                            {student.lastName} {student.firstName} ({student.maSinhVien})
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Hình ảnh điểm danh"
                name="image_Check"
                rules={[{ required: true, message: 'Vui lòng chọn hình ảnh điểm danh' }]}
            >
                <Input placeholder="VD: abc" />
            </Form.Item>
            <Form.Item
                label="Trạng thái"
                name="status"
            >
                <Input value="Đang chờ duyệt" disabled />
            </Form.Item>
            <Form.Item
                label="Chú thích"
                name="note"
            >
                <Input placeholder="VD: Đi hộ" />
            </Form.Item>
        </Form>
    );
}
