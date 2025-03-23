import React, { useState } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
const { Header } = Layout;
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

const AppHeader: React.FC<{ setCollapsed: (collapsed: boolean) => void }> = ({ setCollapsed }) => {
    const [collapsed, setLocalCollapsed] = useState(false);
    const handleCollapse = () => {
        const newCollapsed = !collapsed;
        setLocalCollapsed(newCollapsed);
        setCollapsed(newCollapsed);
    };
    return (
        <Header style={{
            padding: 0,
            display: 'flex',
            alignItems: 'center'
        }}>
            <Button
                className='dark:text-white'
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={handleCollapse}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
        </Header>
    )
}

export default AppHeader;