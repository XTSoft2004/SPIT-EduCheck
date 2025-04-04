'use client'

import { Form, Input, Button, message, Card } from 'antd'
import { useState } from 'react'
import { changePassword } from '@/actions/user.actions'
import { IUSerUpdate } from '@/types/user'

export default function ChangePasswordPage() {
    const [form] = Form.useForm<IUSerUpdate>()
    const [loading, setLoading] = useState(false)

    const onFinish = async (values: IUSerUpdate) => {
        setLoading(true)
        try {
            const res = await changePassword(values)

            if (res.ok) {
                message.success('Đổi mật khẩu thành công!')
                form.resetFields()
            } else {
                message.error(res.message || 'Đổi mật khẩu thất bại.')
            }
        } catch (err) {
            message.error('Có lỗi xảy ra.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center transition-colors mt-10">
            <Card className="w-full max-w-md shadow-lg rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
                    Đổi mật khẩu
                </h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        label={<span className="text-gray-800 dark:text-gray-200">Mật khẩu cũ</span>}
                        name="oldPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu cũ" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-800 dark:text-gray-200">Mật khẩu mới</span>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-gray-800 dark:text-gray-200">Xác nhận mật khẩu mới</span>}
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject('Mật khẩu xác nhận không khớp')
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
