import React from 'react';
import { Button, Form, Input, Select, Upload } from "antd";
import { FormInstance } from "antd/es/form";

import { IClass } from '@/types/class';
import { IStudent } from '@/types/student';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface FormClassProps {
    form: FormInstance;
    classes: IClass[];
    students: IStudent[];
}

export default function FormTimesheetAdd({ form, classes, students }: FormClassProps) {
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
                <Form.Item noStyle name="date">
                    <Input
                        type="date"
                        onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const today = new Date();
                            if (selectedDate > today) {
                                form.setFieldsValue({ date: today.toISOString().split('T')[0] });
                            }
                        }}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </Form.Item>
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
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    mode="multiple"
                    placeholder="Chọn sinh viên"
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
                name="imageBase64"
                valuePropName="fileList"
                getValueFromEvent={(e) => Array.isArray(e?.fileList) ? e.fileList : []}
                rules={[{ required: !form.getFieldValue('imageBase64'), message: 'Vui lòng chọn hình ảnh điểm danh' }]}>

                {form.getFieldValue('imageBase64')?.length > 0 && (
                    <img
                        src={`http://xtcoder2004.io.vn:5000/extension/image?nameFile=${form.getFieldValue('imageBase64')}`}
                        alt="Hình ảnh điểm danh"
                        style={{ width: "200px", height: "auto", marginBottom: "10px" }}
                        loading="lazy"
                    />
                )}

                <Upload
                    name="imageBase64"
                    listType="picture"
                    accept="image/*"
                    beforeUpload={() => false} // Prevent auto upload
                    maxCount={1}
                    showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                    onChange={(info) => {
                        if (info.file.status === 'done') {
                            // Handle successful upload
                        } else if (info.file.status === 'error') {
                            // Handle upload failure
                        }
                    }}
                >
                    <Button icon={<UploadOutlined />}>
                        Tải lên hình ảnh điểm danh
                    </Button>
                </Upload>
            </Form.Item>
            <Form.Item
                label='Trạng thái'
                name='status'
            >
                <Input value="Đang chờ duyệt" placeholder='Đang chờ duyệt' disabled />
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
