"use client";

import React, { useState, useEffect } from "react";
import type { BadgeProps } from "antd";
import { Badge, Calendar, Dropdown, Modal, Form, Input, Select, Button, List } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import styles from "./page.module.css";

const { Option } = Select;

const initialEvents: Record<string, { type: string; content: string }[]> = {
    "08/03/2025": [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
    ],
    "10/03/2025": [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." },
    ],
};

const CalendarPage: React.FC = () => {
    const [events, setEvents] = useState(initialEvents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [viewMode, setViewMode] = useState<"calendar" | "day">("calendar");
    const [form] = Form.useForm();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

    const getListData = (value: Dayjs) => {
        const dateStr = value.format("DD/MM/YYYY");
        return events[dateStr] || [];
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className={styles.events}>
                {listData.map((item, index) => (
                    <li key={index}>
                        <Badge status={item.type as BadgeProps["status"]} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    const handleAddEvent = () => {
        form.validateFields().then((values) => {
            if (!selectedDate) return;
            const dateStr = selectedDate.format("DD/MM/YYYY");

            const newEvent = { type: values.type, content: values.content };
            setEvents((prevEvents) => ({
                ...prevEvents,
                [dateStr]: [...(prevEvents[dateStr] || []), newEvent],
            }));

            setIsModalOpen(false);
            form.resetFields();
        });
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

    const handleDateSelect = () => {
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
                            if (source === "date") handleDateSelect();
                        }} />
                    </div>

                </>
            ) : (
                <>
                    <div style={{marginTop: '20px'}}>
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

                            <div style={{ width: "100%", marginTop: "20px" }}>
                                <List
                                    bordered
                                    dataSource={selectedDate ? getListData(selectedDate) : []}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Badge status={item.type as BadgeProps["status"]} text={item.content} />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            <Modal
                title={`Thêm sự kiện - ${selectedDate?.format("DD/MM/YYYY")}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleAddEvent}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="content"
                        label="Nội dung sự kiện"
                        rules={[{ required: true, message: "Nhập nội dung sự kiện" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Loại sự kiện" rules={[{ required: true, message: "Chọn loại sự kiện" }]}>
                        <Select>
                            <Option value="success">Thành công</Option>
                            <Option value="warning">Cảnh báo</Option>
                            <Option value="error">Lỗi</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CalendarPage;
