'use client'

import { useEffect, useState } from 'react'
import {
  getInfoUser,
  updateInfoUser,
  updateAvatar,
} from '@/actions/user.actions'
import { IInfoUser, IInfoUpdate } from '@/types/user'
import { Button, Form, Upload, message, Card, Avatar } from 'antd'
import { CameraOutlined, UserOutlined } from '@ant-design/icons'
import FormProfile from './FormProfile'
import dayjs from 'dayjs'
import SpinLoading from '@/components/ui/Loading/SpinLoading'

export default function ProfilePage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<IInfoUser | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    setLoading(true)
    const res = await getInfoUser()
    if (res.ok) {
      const data = res.data
      setUser(data)
      form.setFieldsValue({
        maSinhVien: data.maSinhVien,
        lastName: data.lastName,
        firstName: data.firstName,
        class: data.class,
        phoneNumber: data.phoneNumber,
        email: data.email,
        gender: data.gender === true ? 'Nam' : 'Nữ',
        dob: dayjs(data.dob),
      })
    } else {
      message.error(res.message || 'Lấy thông tin thất bại')
    }
    setLoading(false)
  }

  const handleUpdate = async (values: any) => {
    setUpdating(true)
    const formData: IInfoUpdate = {
      lastName: values.lastName,
      firstName: values.firstName,
      class: values.class,
      phoneNumber: values.phoneNumber,
      email: values.email,
      gender: values.gender === 'Nam' ? true : false,
      dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
    }

    const res = await updateInfoUser(formData)
    if (res.ok) {
      message.success('Cập nhật thông tin thành công')
      fetchUserInfo()
    } else {
      message.error(res.message || 'Cập nhật thất bại')
    }
    setUpdating(false)
  }

  const handleAvatarUpload = async (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const formData = {
        imageBase64: reader.result as string,
      }
      const res = await updateAvatar(formData)
      if (res.ok) {
        message.success('Cập nhật avatar thành công')
        fetchUserInfo()
      } else {
        message.error(res.message || 'Cập nhật avatar thất bại')
      }
    }
    return false
  }

  if (loading) {
    return <SpinLoading />
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center sm:items-start">
          <Upload showUploadList={false} beforeUpload={handleAvatarUpload}>
            <div className="group cursor-pointer relative w-fit">
              <Avatar
                size={128}
                src={user?.urlAvatar ? user.urlAvatar : undefined}
                icon={!user?.urlAvatar && <UserOutlined />}
                className="border border-gray-300 rounded-full"
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                <CameraOutlined />
              </div>
            </div>
          </Upload>

          <div className="flex flex-col justify-center h-[128px]">
            <div className="text-xl font-semibold">
              {user?.lastName} {user?.firstName}
            </div>
            <div className="text-gray-600">{user?.email}</div>
          </div>
        </div>

        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
          className="flex-1"
          onFinish={handleUpdate}
        >
          <FormProfile disabledFields={['maSinhVien']} />
          <Form.Item className="flex justify-center">
            <Button type="primary" htmlType="submit" loading={updating}>
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
