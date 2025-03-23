"use client";

import React, { useState, useEffect } from "react";
import type { BadgeProps } from "antd";
import { Badge, Calendar, Dropdown, Modal, Form, Input, Select, Button, List } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import styles from "./page.module.css";

import { getTimesheets, createTimesheet, updateTimesheet } from "@/actions/timesheet.actions";
import { getStudents } from "@/actions/student.actions";
import { getClasses } from "@/actions/class.actions";
import { ITimesheet, ITimesheetCreate, ITimesheetUpdate } from "@/types/timesheet";
import { IStudent } from "@/types/student";
import { IClass } from "@/types/class";

const { Option } = Select;

const CalendarPage: React.FC = () => {
    const [events, setEvents] = useState<Record<string, { type: string; content: string }[]>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [viewMode, setViewMode] = useState<"calendar" | "day">("calendar");
    const [form] = Form.useForm();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ITimesheet | null>(null);

    const [students, setStudents] = useState<IStudent[]>([]);
    const [timesheets, setTimesheets] = useState<ITimesheet[]>([]);
    const [classes, setclasses] = useState<IClass[]>([]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode("day");
            } else {
                setViewMode("calendar");
            }
        };

        if (typeof window !== "undefined") {
            handleResize();
            window.addEventListener("resize", handleResize);
        }

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await getStudents();
            if (response.ok)
                setStudents(response.data);
        };

        const fetchTimesheets = async () => {
            const response = await getTimesheets();
            if (response.ok)
                setTimesheets(response.data);
        };

        const fetchClasses = async () => {
            const response = await getClasses();
            if (response.ok)
                setclasses(response.data);
        }

        fetchStudents();
        fetchTimesheets();
        fetchClasses();
    }, []);

    useEffect(() => {
        const formattedEvents: Record<string, { type: string; content: string }[]> = {};
        timesheets.forEach(({ date, status, note, studentId }) => {
            const dateStr = dayjs(date.toString()).format("DD/MM/YYYY");
            if (!formattedEvents[dateStr]) {
                formattedEvents[dateStr] = [];
            }
            const student = students.find(s => s.id === studentId);
            const studentName = student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
            status = status === "Đã duyệt" ? "success" : status === "Đang chờ duyệt" ? "warning" : "error";
            formattedEvents[dateStr].push({ type: status, content: `${studentName}: ${note || "No details"}` });
        });
        setEvents(formattedEvents);
    }, [timesheets, students]);

    const getListData = (value: Dayjs) => {
        const dateStr = value.format("DD/MM/YYYY");
        return events[dateStr] || [];
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <div className={styles.events} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {listData.map((item, index) => {
                    const event = timesheets.find((t) => {
                        const student = students.find(s => s.id === t.studentId);
                        const studentName = student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
                        return `${studentName}: ${t.note || "No details"}` === item.content;
                    });

                    return (
                        <Badge
                            key={index}
                            color={item.type === "success" ? "#52c41a" : item.type === "warning" ? "#faad14" : "#ff4d4f"}
                            text={
                                <Button
                                    type="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (event) {
                                            setSelectedEvent(event);
                                            form.setFieldsValue({
                                                studentId: event.studentId,
                                                classId: event.classId,
                                                timeId: event.timeId,
                                                image_Check: event.image_Check,
                                                note: event.note,
                                            });
                                            setIsModalOpen(true);
                                        }
                                    }}
                                    style={{
                                        fontSize: "12px",
                                        padding: "4px",
                                        backgroundColor: "transparent",
                                        borderColor: "transparent",
                                        width: "100%",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        color: "black",
                                    }}
                                >
                                    {item.content}
                                </Button>
                            }
                        />
                    );
                })}
            </div>
        );
    };

    const handleAddEvent = async () => {
        try {
            const values = await form.validateFields();
            if (!selectedDate) return;

            const newTimesheet: ITimesheetCreate = {
                studentId: values.studentId,
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
                    studentId: values.studentId,
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
                    studentId: values.studentId,
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

    const handlePrevDay = () => {
        if (selectedDate) {
            setSelectedDate(selectedDate.subtract(1, "day"));
        } else {
            setSelectedDate(dayjs().subtract(1, "day"));
        }
    };

    const handleNextDay = () => {
        if (selectedDate) {
            setSelectedDate(selectedDate.add(1, "day"));
        } else {
            setSelectedDate(dayjs().add(1, "day"));
        }
    };

    const handleDateChange = (date: Dayjs) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    }

    const handleDateSelect = (date: Dayjs) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    return (
        <div>
            {viewMode === "calendar" ? (
                <>
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "10px",
                            borderRadius: "8px",
                        }}
                    >
                        <Calendar cellRender={dateCellRender} onSelect={(date, { source }) => {
                            if (source === "date") handleDateSelect(date);
                        }} />
                    </div>

                </>
            ) : (
                <>
                    <div style={{ marginTop: '20px' }}>
                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "10px",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                width: "100%",
                                height: '100%',
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                <Button onClick={handlePrevDay}>← Ngày trước</Button>

                                <Dropdown
                                    open={isCalendarOpen}
                                    onOpenChange={setIsCalendarOpen}
                                    overlay={
                                        <div
                                            style={{
                                                width: 300,
                                                background: "white",
                                                padding: 10,
                                                borderRadius: 8,
                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                position: "absolute",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                            }}
                                        >
                                            <Calendar fullscreen={false} onSelect={handleDateChange} />
                                        </div>
                                    }
                                    trigger={["click"]}
                                    placement="bottomCenter"
                                >
                                    <h2 style={{ cursor: "pointer", margin: 0 }} onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                                        {selectedDate ? selectedDate.format("DD/MM/YYYY") : "Chưa chọn ngày"}
                                    </h2>
                                </Dropdown>

                                <Button onClick={handleNextDay}>Ngày sau →</Button>
                            </div>

                            <Button onClick={() => setIsModalOpen(true)} style={{ marginTop: 10, marginBottom: 10 }}>
                                Thêm sự kiện
                            </Button>

                            <div style={{ width: "100%", marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {selectedDate && getListData(selectedDate).map((item, index) => {
                                    const event = timesheets.find((t) => {
                                        const student = students.find(s => s.id === t.studentId);
                                        const studentName = student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
                                        return `${studentName}: ${t.note || "No details"}` === item.content;
                                    });

                                    return (
                                        <Badge
                                            key={index}
                                            color={item.type === "success" ? "#52c41a" : item.type === "warning" ? "#faad14" : "#ff4d4f"}
                                            text={
                                                <Button
                                                    key={index}
                                                    type="primary"
                                                    onClick={() => {
                                                        if (event) {
                                                            setSelectedEvent(event);
                                                            form.setFieldsValue({
                                                                studentId: event.studentId,
                                                                classId: event.classId,
                                                                timeId: event.timeId,
                                                                image_Check: event.image_Check,
                                                                note: event.note,
                                                            });
                                                            setIsModalOpen(true);
                                                        }
                                                    }}
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        backgroundColor: item.type === "success" ? "#52c41a" :
                                                            item.type === "warning" ? "#faad14" : "#ff4d4f",
                                                        borderColor: "transparent",
                                                    }}
                                                >
                                                    {item.content}
                                                </Button>
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <Modal
                title={`Điểm danh - ${selectedDate?.format("DD/MM/YYYY")}`}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                    form.resetFields();
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setSelectedEvent(null);
                        setIsModalOpen(false);
                        form.resetFields();
                    }}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={selectedEvent ? handleSaveEvent : handleAddEvent}>
                        {selectedEvent ? "Cập nhật" : "Thêm mới"}
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="studentId" label="Sinh viên" rules={[{ required: true, message: "Chọn sinh viên" }]}>
                        <Select>
                            {students.map(student => (
                                <Option key={student.id} value={student.id}>{`${student.firstName} ${student.lastName}`}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="classId" label="Nhóm" rules={[{ required: true, message: "Chọn nhóm" }]}>
                        <Select>
                            {classes.map(classes => (
                                <Option key={classes.id} value={classes.id}>{`${classes.name}`}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="timeId" label="Buổi" rules={[{ required: true, message: "Chọn buổi" }]}>
                        <Select>
                            <Option value="1">Buổi sáng</Option>
                            <Option value="2">Buổi chiều</Option>
                            <Option value="3">Buổi tối</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="image_Check"
                        label="Ảnh minh chứng"
                        rules={[{ required: true, message: "Nhập đường dẫn ảnh minh chứng" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Chú thích"
                        rules={[{ required: false, message: "Nhập chú thích" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CalendarPage;
