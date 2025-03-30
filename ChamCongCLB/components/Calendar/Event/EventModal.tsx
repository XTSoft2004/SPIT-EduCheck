import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import type { Dayjs } from "dayjs";

import { ITimesheet, ITimesheetCreate, ITimesheetUpdate } from "@/types/timesheet";
import { IStudent } from "@/types/student";
import { IClass } from "@/types/class";

import { getAllStudents } from "@/actions/student.actions";
import { createTimesheet, deleteTimesheet, getTimesheets, updateTimesheet } from "@/actions/timesheet.actions";

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

    const handleAddEvent = async () => {
        try {
            const values = await form.validateFields();
            if (!selectedDate) return;

            const newTimesheet: ITimesheetCreate = {
                studentsId: values.studentsId,
                classId: values.classId,
                timeId: values.timeId,
                date: selectedDate.format("YYYY-MM-DD"),
                image_Check: values.image_Check,
                note: values.note || "",
                status: "Đang chờ duyệt"
            };

            const response = await createTimesheet(newTimesheet);

            if (response.ok) {
                const responseTimesheets = await getTimesheets();
                if (responseTimesheets.ok)
                    setTimesheets(responseTimesheets.data);

                setIsModalOpen(false);
                form.resetFields();
            }
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const handleSaveEvent = async () => {
        try {
            const values = await form.validateFields();
            if (!selectedDate) return;

            if (selectedEvent) {
                const updatedTimesheet: ITimesheetUpdate = {
                    id: selectedEvent.id,
                    studentsId: values.studentsId,
                    classId: values.classId,
                    timeId: values.timeId,
                    date: selectedDate.format("YYYY-MM-DD"),
                    image_Check: values.image_Check,
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
                    image_Check: values.image_Check,
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
            <Form form={form} layout="vertical">
                {/* Chọn sinh viên */}
                <Form.Item
                    name="studentsId"
                    label="Sinh viên"
                    rules={[{ required: true, message: "Chọn sinh viên", type: 'array' }]}
                >
                    <Select mode="multiple" placeholder="Chọn sinh viên">
                        {students.map((student) => (
                            <Select.Option key={student.id} value={student.id}>
                                {`${student.lastName} ${student.firstName} (${student.maSinhVien})`}
                            </Select.Option>
                        ))}
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
                    name="image_Check"
                    label="Ảnh minh chứng"
                    rules={[{ required: true, message: "Nhập đường dẫn ảnh minh chứng" }]}
                >
                    <Input placeholder="Nhập URL ảnh" />
                </Form.Item>

                {/* Nhập chú thích */}
                <Form.Item name="note" label="Chú thích">
                    <Input.TextArea placeholder="Nhập chú thích (nếu có)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EventModal;
