import { message } from "antd";

const MessageNotification = {
    success: (msg: string) => message.success(msg),
    info: (msg: string) => message.info(msg),
    warning: (msg: string) => message.warning(msg),
    error: (msg: string) => message.error(msg),
};

export default MessageNotification;
