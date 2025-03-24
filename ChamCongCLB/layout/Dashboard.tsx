'use client'
import React, { useState } from 'react';
import { Breadcrumb, Button, Layout, Menu, theme, Drawer } from 'antd';

const { Header, Sider, Content } = Layout;

import AppHeader from './AppHeader';
import AppSider from './AppSider';





export default function Dashboard({
    children,
}: {
    children: React.ReactNode
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ height: '100vh' }}>


            <AppSider setCollapsed={setCollapsed} collapsed={collapsed} />

            <Layout style={{ height: '100vh' }}>
                <AppHeader setCollapsed={setCollapsed} collapsed={collapsed} />
                {/* <Breadcrumb
                    items={[
                        { key: '/uploads', title: <a href="/uploads">Home</a> },
                        { title: 'List' },
                        { title: 'App' }
                    ]}
                    style={{ margin: '16px 0' }}
                /> */}
                <div
                    className='dark:bg-[var(--bg-dark-mode)] dark:text-white'
                    style={{
                        padding: 24,
                        // background: colorBgContainer,
                        // borderRadius: borderRadiusLG,
                        flex: 1,
                        overflow: 'auto'
                    }}
                > {children}
                </div>
            </Layout>
        </Layout >
    );
};
