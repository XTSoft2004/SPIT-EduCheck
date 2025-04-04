import { Role } from "@/context/AuthContext";
import { Button } from "antd";
import { CirclePlus } from "lucide-react";

interface ButtonAddTableProps {
    btnText: string;
    role: Role;
    onClick: () => void;
}

export function ButtonAddTable({ btnText, role, onClick }: ButtonAddTableProps) {
    return (
        <>
            {role === Role.ADMIN && (
                <div className="w-full md:w-auto flex items-center gap-2">
                    <Button className="w-full md:w-auto flex items-center gap-2" onClick={onClick}>
                        <CirclePlus size={20} />
                        {btnText}
                    </Button>
                </div >
            )
            }
        </>
    );
}
