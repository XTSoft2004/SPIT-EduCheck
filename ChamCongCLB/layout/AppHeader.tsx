import React, { useState } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
const { Header } = Layout;
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import UserDropdown from '@/components/header/UserDropdown';

import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';

const AppHeader: React.FC<{ setCollapsed: (collapsed: boolean) => void }> = ({ setCollapsed }) => {
    const [collapsed, setLocalCollapsed] = useState(false);
    const handleCollapse = () => {
        const newCollapsed = !collapsed;
        setLocalCollapsed(newCollapsed);
        setCollapsed(newCollapsed);
    };
    return (
        <Header className="p-0 flex items-center justify-between bg-white dark:bg-[var(--bg-dark-mode)] border-b-[1px] dark:border-gray-800">
            <Button
                className="dark:text-white !hover:bg-transparent !hover:text-inherit"
                type="text"
                icon={
                    <span className="dark:text-white text-gray-500">
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </span>
                }
                onClick={handleCollapse}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div className="flex items-center gap-4">
                <ThemeToggleButton />
                {/* DropDrown User */}
                <UserDropdown />
            </div>
        </Header>
    )
}

export default AppHeader;