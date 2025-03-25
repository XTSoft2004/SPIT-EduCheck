import React from "react";
import { Modal } from "antd";

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode; // Cho phép tùy chỉnh footer
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    return (
        <Modal
            title={title || "Thông tin"}
            open={isOpen}
            onCancel={onClose}
            width={600}
            footer={footer || null} // Nếu không truyền, không có footer
        >
            <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "10px" }}>
                {children}
            </div>
        </Modal>
    );
};

export default CustomModal;
