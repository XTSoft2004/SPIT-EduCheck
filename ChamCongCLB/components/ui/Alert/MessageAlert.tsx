import React from 'react';
import { message } from 'antd';

interface MessageProps {
    type: 'success' | 'error' | 'info' | 'warning';
    content: string;
}

const MessageAlert: React.FC<MessageProps> = ({ type, content }) => {
    const [messageApi, contextHolder] = message.useMessage();

    React.useEffect(() => {
        messageApi.open({
            type,
            content,
            className: 'custom-class',
            style: {
                marginTop: '20vh',
                marginRight: '20px', // Ensures it appears at the top-right
                position: 'absolute',
                right: '0',
                top: '0',
            },
        });
    }, [type, content, messageApi]);

    return <>{contextHolder}</>;
};

export default MessageAlert;
