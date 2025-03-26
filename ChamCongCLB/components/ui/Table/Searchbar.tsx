import { Button, Form, Input } from "antd";


interface SearchBarProps {
    setSearchText: (text: string) => void;
}
export default function Searchbar({ setSearchText }: SearchBarProps) {
    const [formSearch] = Form.useForm();

    return (
        <>
            <Form
                form={formSearch}
                className="flex flex-col md:flex-row justify-end items-stretch gap-2 w-full md:w-auto"
                onFinish={() => {
                    setSearchText(formSearch.getFieldValue('search'));
                }}
            >
                <Form.Item name="search" className="w-full md:w-auto m-0 !important" >
                    <Input
                        placeholder="Tìm kiếm..."
                        className="w-full md:w-[200px]"
                        style={{ height: '100%' }}
                    />
                </Form.Item>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <Button className="w-full md:w-auto" type="primary" htmlType="submit">
                        Tìm kiếm
                    </Button>
                    <Button className="w-full md:w-auto" type="primary" onClick={() => setSearchText('')}>
                        Reset
                    </Button>
                </div>
            </Form>
        </>
    );
}