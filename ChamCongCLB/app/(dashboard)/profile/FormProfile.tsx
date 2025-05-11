'use client'

import React from 'react'
import { Form, Input, DatePicker, Select } from 'antd'

interface FormProfileProps {
  disabledFields?: string[]
}

export default function FormProfile({ disabledFields = [] }: FormProfileProps) {
  return (
    <>
      <Form.Item
        label="Mã sinh viên"
        name="maSinhVien"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item label="Họ và Tên" required>
        <Input.Group compact>
          <Form.Item
            name="lastName"
            noStyle
            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
          >
            <Input
              style={{ width: '60%' }}
              placeholder="Họ"
              disabled={disabledFields.includes('lastName')}
            />
          </Form.Item>
          <Form.Item
            name="firstName"
            noStyle
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input
              style={{ width: '40%' }}
              placeholder="Tên"
              disabled={disabledFields.includes('firstName')}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item
        label="Lớp"
        name="class"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        rules={[{ required: true, message: 'Vui lòng nhập lớp!' }]}
      >
        <Input disabled={disabledFields.includes('class')} />
      </Form.Item>

      <Form.Item label="Giới tính và Ngày sinh" required>
        <Input.Group compact>
          <Form.Item
            name="gender"
            noStyle
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select style={{ width: '30%' }} placeholder="Giới tính">
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dob"
            noStyle
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '70%' }}
              placeholder="Ngày sinh"
              className="transition-all duration-300 ease-in-out transform"
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phoneNumber"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        rules={[
          { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
      >
        <Input />
      </Form.Item>
    </>
  )
}
