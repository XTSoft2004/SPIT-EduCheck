import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext'
import { CalendarRange, CircleUserRound, School, CalendarDays, AlignVerticalDistributeEnd, Book, Computer, LayoutGrid, SquareChartGantt } from 'lucide-react'

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '1',
        icon: <SquareChartGantt />,
        label: 'Quản lý',
        children: [
            { key: '/user', label: 'Tài khoản', icon: <CircleUserRound size={20} /> },
            { key: '/student', label: 'Sinh viên', icon: <School size={20} /> },
            { key: '/class', label: 'Lớp', icon: <AlignVerticalDistributeEnd size={20} /> },
            { key: '/lecture', label: 'Giảng viên', icon: <Book size={20} /> },
            { key: '/semeter', label: 'Học kỳ', icon: <LayoutGrid size={20} /> },
            { key: '/course', label: 'Học phần', icon: <Computer size={20} /> },
            { key: '/timesheet', label: 'Chấm công', icon: <CalendarDays size={20} /> },
        ],
    }
    , {
        key: '/calendar',
        icon: <CalendarRange />,
        label: 'Lịch chấm công'
    }
];

interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

const MenuSidebar: React.FC = () => {
    const { theme, toggleTheme } = useTheme()
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
    const router = useRouter();
    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    return (
        <>
            {console.log('Theme: ', theme)}
            <Menu
                theme={theme}
                mode="inline"
                defaultSelectedKeys={['231']}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                items={items}
                onClick={({ key }) => router.push(key)}
            />
        </>

    );
};

export default MenuSidebar;