'use client'
import { useEffect, useState } from 'react'
import { logout } from '@/actions/auth.actions'
import Dropdown from 'antd/es/dropdown/dropdown'
import { Avatar, Space } from 'antd'
import { Menu } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons'

import { getInfoUser, getMe } from '@/actions/user.actions'

import { IInfoUser, IUser } from '@/types/user'
import { useRouter } from 'next/navigation'

export default function UserDropdown() {
  const [user, setUser] = useState<IUser | null>(null)
  const [info, setInfo] = useState<IInfoUser | null>(null)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleProfile = async () => {
    router.push('/profile')
  }

  const handleChangePassword = async () => {
    router.push('/profile/change-password')
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getMe()
      setUser(user.data)
    }

    const fetchInfo = async () => {
      const info = await getInfoUser()
      setInfo(info.data)
    }
    fetchUser()
    fetchInfo()
  }, [])

  // Menu Dropdown
  const menu = (
    <Menu className="pt-5">
      {user?.studentName !== '' ? (
        <>
          <Menu.Item key="profile" onClick={handleProfile}>
            <div className="flex items-center">
              {info?.urlAvatar ? (
                <Avatar
                  src={info?.urlAvatar}
                  size="large"
                  className="mr-3"
                  alt="avatar"
                />
              ) : (
                <Avatar icon={<UserOutlined />} size="large" className="mr-3" />
              )}
              <div>
                <div className="font-bold">{user?.studentName}</div>
                <div className="text-gray-500 text-sm">{info?.email}</div>
              </div>
            </div>
          </Menu.Item>
          <Menu.Divider />
        </>
      ) : undefined}

      <Menu.Item
        key="change-password"
        icon={<LockOutlined />}
        onClick={handleChangePassword}
      >
        Đổi mật khẩu
      </Menu.Item>

      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        danger
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <Space className="cursor-pointer">
        <div className="mr-5 flex items-center">
          {info?.urlAvatar ? (
            <Avatar
              src={info?.urlAvatar}
              alt="avatar"
              size={40}
              className="!border-2 !border-white dark:!border-gray-800"
            />
          ) : (
            <Avatar
              icon={<UserOutlined />}
              size={40}
              className="!border-2 !border-white dark:!border-gray-800"
            />
          )}
          <span className="ml-2 sm:block hidden font-bold">
            {user?.username?.toUpperCase()}
          </span>{' '}
          {/* fullName */}
        </div>
        {/* <span className="dark:text-white">Admin</span> */}
      </Space>
    </Dropdown>
  )
}
