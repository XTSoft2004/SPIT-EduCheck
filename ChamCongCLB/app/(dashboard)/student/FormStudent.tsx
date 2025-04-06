import { Form, Input, Select, DatePicker } from "antd";
import { FormInstance } from "antd/es/form";

const { Option } = Select;

interface FormStudentProps {
    form: FormInstance;
}

export default function FormStudent({ form }: FormStudentProps) {
    return (
        <Form form={form} layout="vertical">
            <Form.Item
                label="Mã sinh viên"
                name="maSinhVien"
                rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
            >
                <Input placeholder="VD: 22T1020784" />
            </Form.Item>
            <Form.Item
                label="Họ"
                name="lastName"
                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
            >
                <Input placeholder="VD: Trần Xuân" />
            </Form.Item>
            <Form.Item
                label="Tên"
                name="firstName"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
                <Input placeholder="VD: Trường" />
            </Form.Item>
            <Form.Item
                label="Lớp"
                name="class"
                rules={[
                    { required: true, message: 'Vui lòng nhập lớp!' },
                ]}
            >
                <Input placeholder="VD: CNTT K46B" />
            </Form.Item>
            <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
            >
                <Input placeholder="VD: 096754978" />
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
                <Input placeholder="VD: 22T1020784@husc.edu.vn" />
            </Form.Item>
            <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
                <Select>
                    <Option value={true}>Nam</Option>
                    <Option value={false}>Nữ</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Chọn ngày sinh"
                name="dob"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
                <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày sinh" />
            </Form.Item>
        </Form>
    );
}
