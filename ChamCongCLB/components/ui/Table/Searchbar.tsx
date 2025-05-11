import { Button, Form, Input, message } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

interface SearchBarProps {
    setSearchText: (text: string) => void;
}

export default function Searchbar({ setSearchText }: SearchBarProps) {
    const [formSearch] = Form.useForm();

    const handleSearch = async () => {
        try {
            // Kiểm tra validation trước khi lấy dữ liệu
            await formSearch.validateFields();
            setSearchText(formSearch.getFieldValue("search"));
        } catch (error) {
            message.error("Vui lòng nhập từ khóa tìm kiếm!");
        }
    };

    return (
        <Form
            form={formSearch}
            className="flex flex-col md:flex-row justify-end items-stretch gap-2 w-full md:w-auto"
            onFinish={handleSearch}
        >
            <Form.Item
                name="search"
                className="w-full md:w-auto m-0 !important"
                rules={[{ required: true, message: "Không được bỏ trống!" }]}
            >
                <Input
                    placeholder="Tìm kiếm..."
                    className="w-full md:w-[200px]"
                    style={{ height: "100%" }}
                    prefix={<SearchOutlined />}
                    onPressEnter={handleSearch}
                    id="search-input"
                />
            </Form.Item>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Button
                    className="w-full md:w-auto"
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    id="btn-search"
                >
                    Tìm kiếm
                </Button>
                <Button
                    className="w-full md:w-auto"
                    type="default"
                    onClick={() => {
                        formSearch.resetFields(); // Xóa nội dung input
                        setSearchText(""); // Reset kết quả tìm kiếm
                    }}
                    icon={<ReloadOutlined />}
                    id="btn-reset"
                >
                    Reset
                </Button>
            </div>
        </Form>
    );
}
