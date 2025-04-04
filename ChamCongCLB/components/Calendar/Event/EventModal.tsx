import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button, SelectProps, Upload } from "antd";
import type { Dayjs } from "dayjs";

import { ITimesheet, ITimesheetCreate, ITimesheetUpdate } from "@/types/timesheet";
import { IStudent } from "@/types/student";
import { IClass } from "@/types/class";

import { getAllStudents } from "@/actions/student.actions";
import { createTimesheet, deleteTimesheet, getTimesheets, updateTimesheet } from "@/actions/timesheet.actions";
import { UploadOutlined } from "@ant-design/icons";

interface EventModalProps {
    isOpen: boolean;
    selectedDate?: Dayjs | null;
    selectedEvent?: ITimesheet | null;
    form: any;
    onClose: () => void;
    setIsModalOpen: (isOpen: boolean) => void;
    setSelectedEvent: (isOpen: ITimesheet | null) => void;
    classes: IClass[];
    setTimesheets: (timesheets: ITimesheet[]) => void;
}

const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    selectedDate,
    selectedEvent,
    form,
    onClose,
    setIsModalOpen,
    setSelectedEvent,
    classes,
    setTimesheets,
}) => {
    const [students, setStudents] = useState<IStudent[]>([]);
    const times = [
        {
            id: 1,
            name: "Buổi sáng",
        },
        {
            id: 2,
            name: "Buổi chiều",
        },
        {
            id: 3,
            name: "Buổi tối",
        }
    ];

    useEffect(() => {
        const fetchDataStudents = async () => {
            const studentRes = await getAllStudents();
            if (studentRes.ok) setStudents(studentRes.data);
        };
        fetchDataStudents();
    }, []);

    // ✅ Client Component (React)

    const handleAddEvent = async () => {
        try {
            const values = await form.validateFields()
            if (!selectedDate) return

            const file = values.imageBase64?.[0]?.originFileObj
            if (!file) {
                console.error("Chưa có file hợp lệ!")
                return
            }

            // Nếu file là File, chuyển nó thành Base64
            const imageBase64 = await fileToBase64(file)

            const newTimesheet: ITimesheetCreate = {
                studentsId: values.studentsId,
                classId: values.classId,
                timeId: values.timeId,
                date: selectedDate.format("YYYY-MM-DD"),
                imageBase64: imageBase64, // Đảm bảo gửi Base64 nếu là file
                status: 'Đang chờ duyệt',
                note: values.note || "",
            }

            const response = await createTimesheet(newTimesheet)

            if (response.ok) {
                const list = await getTimesheets()
                if (list.ok) setTimesheets(list.data)

                setIsModalOpen(false)
                form.resetFields()
            }
        } catch (error) {
            console.error("Error adding event:", error)
        }
    }

    const handleSaveEvent = async () => {
        try {
            const values = await form.validateFields();
            if (!selectedDate) return;
            // const file = values.imageBase64?.[0]?.originFileObj;

            // Chuyển file thành Base64 nếu có
            // const base64Image = file ? await fileToBase64(file) : values.imageBase64;
            const file = values.imageBase64?.[0]?.originFileObj
            // if (!file) {
            //     console.error("Chưa có file hợp lệ!")
            //     return
            // }
            const base64Image = file ? await fileToBase64(file) : values.imageBase64;
            if (selectedEvent) {
                const updatedTimesheet: ITimesheetUpdate = {
                    id: selectedEvent.id,
                    studentsId: values.studentsId,
                    classId: values.classId,
                    timeId: values.timeId,
                    date: selectedDate.format("YYYY-MM-DD"),
                    imageBase64: base64Image, // Dùng Base64 nếu là file
                    note: values.note || "",
                    status: selectedEvent.status,
                };
                const response = await updateTimesheet(updatedTimesheet);

                if (response.ok) {
                    const responseTimesheets = await getTimesheets();
                    if (responseTimesheets.ok) setTimesheets(responseTimesheets.data);
                }
            } else {
                const newTimesheet: ITimesheetCreate = {
                    studentsId: values.studentsId,
                    classId: values.classId,
                    timeId: values.timeId,
                    date: selectedDate.format("YYYY-MM-DD"),
                    imageBase64: base64Image, // Dùng Base64 nếu là file
                    note: values.note || "",
                    status: "Đang chờ duyệt",
                };

                const response = await createTimesheet(newTimesheet);
                if (response.ok) {
                    const responseTimesheets = await getTimesheets();
                    if (responseTimesheets.ok) setTimesheets(responseTimesheets.data);
                }
            }

            setIsModalOpen(false);
            form.resetFields();
            setSelectedEvent(null);
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    const handleDeleteEvent = async (timesheet: ITimesheet) => {
        if (!timesheet.id) return;

        if (!confirm("Bạn có chắc chắn muốn xóa buổi điểm danh này không?")) return;

        try {
            const response = await deleteTimesheet(timesheet);
            if (response.ok) {
                const responseTimesheets = await getTimesheets();
                if (responseTimesheets.ok) setTimesheets(responseTimesheets.data);
            }
            setIsModalOpen(false);
            form.resetFields();
            setSelectedEvent(null);
        }
        catch (error) {
            console.error("Error deleting event:", error);
        }
    }

    const options: SelectProps['options'] = [];

    students.forEach((student) => {
        options.push({
            value: student.id,
            label: `${student.lastName} ${student.firstName} (${student.maSinhVien.toUpperCase()})`,
        });
    });

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <Modal
            title={`Điểm danh - ${selectedDate?.format("DD/MM/YYYY")}`}
            open={isOpen}
            onCancel={() => {
                setIsModalOpen(false);
                setSelectedEvent(null);
                form.resetFields();
            }}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                selectedEvent && (
                    <Button key="delete" danger onClick={() => handleDeleteEvent(selectedEvent)}>
                        Xóa
                    </Button>
                ),
                <Button key="submit" type="primary" onClick={selectedEvent ? handleSaveEvent : handleAddEvent}>
                    {selectedEvent ? "Cập nhật" : "Thêm mới"}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" style={{ maxHeight: "400px", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {/* Chọn sinh viên */}
                <Form.Item
                    name="studentsId"
                    label="Sinh viên"
                    rules={[{ required: true, message: "Chọn sinh viên", type: 'array' }]}
                >
                    <Select
                        showSearch
                        mode="multiple"
                        allowClear
                        placeholder="Chọn sinh viên"
                        optionFilterProp="label"
                        options={options}
                    >
                    </Select>
                </Form.Item>

                {/* Chọn nhóm */}
                <Form.Item
                    name="classId"
                    label="Nhóm"
                    rules={[{ required: true, message: "Chọn nhóm" }]}
                >
                    <Select placeholder="Chọn nhóm">
                        {classes.map((group) => (
                            <Select.Option key={group.id} value={group.id}>
                                {group.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Chọn buổi */}
                <Form.Item
                    name="timeId"
                    label="Buổi"
                    rules={[{ required: true, message: "Chọn buổi" }]}
                >
                    <Select placeholder="Chọn buổi">
                        {times.map((time) => (
                            <Select.Option key={time.id} value={time.id}>
                                {time.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Nhập đường dẫn ảnh */}
                <Form.Item
                    label="Hình ảnh điểm danh"
                    name="imageBase64"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    rules={[{ required: !form.getFieldValue('imageBase64'), message: 'Vui lòng chọn hình ảnh điểm danh' }]}>

                    {form.getFieldValue('imageBase64')?.length > 0 && (
                        <img
                            src={`data:image/png;base64,${form.getFieldValue('imageBase64')}`}
                            alt="Hình ảnh điểm danh"
                            style={{ width: "200px", height: "auto", marginBottom: "10px" }}
                        />
                    )}

                    <Upload
                        name="imageBase64"
                        listType="picture"
                        accept="image/*"
                        beforeUpload={() => false} // Prevent auto upload
                        maxCount={1}
                        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                        onChange={(info) => {
                            if (info.file.status === 'done') {
                                // Handle successful upload
                            } else if (info.file.status === 'error') {
                                // Handle upload failure
                            }
                        }}
                    >
                        <Button icon={<UploadOutlined />}>
                            Tải lên hình ảnh điểm danh
                        </Button>
                    </Upload>
                </Form.Item>

                {/* Nhập chú thích */}
                <Form.Item name="note" label="Chú thích">
                    <Input.TextArea placeholder="Nhập chú thích (nếu có)" />
                </Form.Item>
            </Form>
        </Modal >
    );
};

export default EventModal;
