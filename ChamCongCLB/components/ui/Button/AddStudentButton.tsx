import { createMutipleAccount } from "@/actions/auth.actions";
import { Button, message } from "antd";
import { CirclePlus } from "lucide-react";

const AddStudentButton: React.FC<{ selectedKeys: React.Key[]; onSuccess: () => void }> = ({ selectedKeys, onSuccess }) => {
    const handleCreate = async () => {
        if (selectedKeys.length === 0) {
            message.warning("Vui lòng chọn ít nhất một sinh viên!");
            return;
        }
        const formPost = selectedKeys.map(key => key.toString());
        const loadingMessage = message.loading('Đang tạo tài khoản ...', 0);

        try {
            const response = await createMutipleAccount(formPost);
            // Tắt loading khi nhận được kết quả
            loadingMessage();
            if (response.ok) {
                message.success(response.message);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            loadingMessage();
            message.error('Đã có lỗi xảy ra!');
        }

        onSuccess();
    };

    return (
        <Button className="w-full md:w-auto flex items-center gap-2" onClick={handleCreate}>
            <CirclePlus size={20} />
            Tạo tài khoản đang chọn
        </Button>
    );
};

export default AddStudentButton;
