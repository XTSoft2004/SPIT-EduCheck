import React, { useState } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import Image from 'next/image'
const { Header } = Layout;
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import UserDropdown from '@/components/header/UserDropdown';

import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import SwitchSemester from '@/components/Dashboard/Semesters/SwitchSemester';
import SemesterDropdown from '@/components/ui/dropdown/SemesterDropdown';

const AppHeader: React.FC<{ setCollapsed: (collapsed: boolean) => void, collapsed: boolean }> = ({ setCollapsed, collapsed }) => {
    return (
        <Header className="p-0 flex items-center justify-between bg-white dark:bg-[var(--bg-dark-mode)] border-b-[1px] dark:border-gray-800">
            <Button
                className="dark:text-white !hover:bg-transparent !hover:text-inherit"
                type="text"
                icon={
                    <span className="dark:text-white text-gray-500">
                        {!collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </span>
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div className='flex justify-center items-center py-3 gap-2 lg:hidden'>
                <Image src='/logo/logo-500x500.png' alt="Logo" width={40} height={40} loading="lazy" />
                <p className='dark:text-white font-bold text-xl'>SPIT TEAM</p>
            </div>
            <div className="flex items-center gap-4">
                {/* <SwitchSemester /> */}
                <div className="sm:block hidden">
                    <SemesterDropdown />
                </div>

                <ThemeToggleButton />
                {/* DropDrown User */}
                <UserDropdown />
            </div>
        </Header>
    )
}

export default AppHeader;