import React from 'react';
import { notification } from 'antd';

// Component NotificationBox giúp tái sử dụng và truyền thông báo
const NotificationBox: React.FC<{
    type: 'success' | 'info' | 'error' | 'warning';
    content: string;
    duration?: number; // duration mặc định là 2 giây
}> = ({ type, content, duration = 2 }) => {
    React.useEffect(() => {
        // Hiển thị thông báo
        notification[type]({
            message: 'Notification Title', // Tên tiêu đề
            description: content, // Nội dung thông báo
            duration: duration, // Thời gian hiển thị thông báo
        });
    }, [type, content, duration]);

    return null; // Không cần render UI, chỉ cần trigger thông báo
};

export default NotificationBox;
