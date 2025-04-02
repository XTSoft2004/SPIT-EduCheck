'use client';
import { createAccount } from "@/actions/auth.actions";
import { getUsers } from "@/actions/user.actions";
import { ILoginForm } from "@/types/auth";
import { Button, message } from "antd";
import { CirclePlus } from "lucide-react";
import SnackbarAlert from "../Alert/SnackbarAlertProps";
import { useActionState, useEffect } from "react";

const AddStudentButton: React.FC<{ selectedKeys: React.Key[] }> = ({ selectedKeys }) => {
    const handleCreate = async () => {
        if (selectedKeys.length === 0) {
            message.warning("Vui lòng chọn ít nhất một sinh viên!");
            return;
        }

        useEffect(() => {
            console.log(selectedKeys);
        }, [selectedKeys]);

        // try {
        //     const existingUsers = await getUsers();
        //     const existingUsernames = new Set(existingUsers.data.map((user: { username: string }) => user.username));

        //     const newAccounts: ILoginForm[] = selectedKeys
        //         .map(key => ({
        //             username: key.toString(),
        //             password: '123'
        //         }))
        //         .filter(account => !existingUsernames.has(account.username));

        //     if (newAccounts.length === 0) {
        //         message.info("Tất cả tài khoản đã tồn tại!");
        //         return;
        //     }

        //     await Promise.all(newAccounts.map(async account => {
        //         await createAccount(account)
        //     }));

        //     message.success("Tạo tài khoản thành công!");
        // } catch (error) {
        //     console.error("Lỗi khi tạo tài khoản:", error);
        //     message.error("Có lỗi xảy ra khi tạo tài khoản!");
        // }
    };

    return (
        <Button className="w-full md:w-auto flex items-center gap-2" onClick={handleCreate}>
            <CirclePlus size={20} />
            Tạo tài khoản đang chọn
        </Button>
    );
};

export default AddStudentButton;
