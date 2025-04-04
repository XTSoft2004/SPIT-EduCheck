import React from 'react';
import { Form, Input } from "antd";
import { FormInstance } from "antd/es/form";

interface FormLecturerProps {
    form: FormInstance;
}

export default function FormLecturer({ form }: FormLecturerProps) {
    return (
        <Form
            form={form}
            layout="vertical"
        >
            <Form.Item
                label="Tên giảng viên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên!' }]}
            >
                <Input placeholder="VD: Lê Nguyễn Thuỷ Nhi" />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                    { pattern: /^[a-zA-Z0-9._%+-]+@husc\.edu\.vn$/, message: 'Email phải thuộc miền husc.edu.vn!' }
                ]}
            >
                <Input placeholder="VD: lntnhi@husc.edu.vn" />
            </Form.Item>
            <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
            >
                <Input placeholder="VD: 0766597016" />
            </Form.Item>
        </Form>
    );
}
