"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Form, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import EventModal from "@/components/Calendar/Event/EventModal";
import EventList from "@/components/Calendar/Event/EventList";
import { ITimesheet } from "@/types/timesheet";
import { getTimesheets } from "@/actions/timesheet.actions";
import { getClasses } from "@/actions/class.actions";
import { IClass } from "@/types/class";

import CalendarDayView from "@/components/Calendar/CalendarDayView";
import SpinLoading from "../ui/Loading/SpinLoading";

const CalendarPage: React.FC = () => {
    const [events, setEvents] = useState<Record<string, { id: number, type: string; content: string }[]>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [timesheets, setTimesheets] = useState<ITimesheet[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ITimesheet | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [timesheetRes, classRes] = await Promise.all([getTimesheets(), getClasses()]);
                if (timesheetRes.ok) setTimesheets(timesheetRes.data);
                if (classRes.ok) setClasses(classRes.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (classes.length === 0) return;
        const formattedEvents: Record<string, { id: number; type: string; content: string }[]> = {};
        timesheets.forEach(({ id, classId, date, status }) => {
            const dateStr = dayjs(date.toString()).format("DD/MM/YYYY");
            const nameClass = classes.find((c) => c.id === classId)?.name || "Lớp không xác định";
            if (!formattedEvents[dateStr]) {
                formattedEvents[dateStr] = [];
            }
            formattedEvents[dateStr].push({ id, type: status, content: nameClass });
        });
        setEvents({ ...formattedEvents });
    }, [timesheets, classes]);

    // Giữ nguyên ngày hiển thị khi bấm vào modal và close không bị di chuyển
    const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs());

    return (
        <>
            {(loading || classes.length === 0) ? (
                <SpinLoading />
            ) : (
                <>
                    {/* Chế độ Calendar (ẩn trên mobile) */}
                    <div className="hidden sm:block">
                        <Calendar
                            value={calendarDate} // Giữ nguyên ngày hiển thị
                            dateCellRender={(value) => (
                                <EventList
                                    timesheets={timesheets}
                                    value={value}
                                    events={events}
                                    form={form}
                                    setIsModalOpen={setIsModalOpen}
                                    setSelectedEvent={setSelectedEvent}
                                    setSelectedDate={setSelectedDate}
                                />
                            )}
                            onSelect={(date, { source }) => {
                                if (date.isAfter(dayjs(), "day")) {
                                    message.error("Không thể chọn ngày trước hôm nay");
                                    return;
                                } // Không cho chọn ngày trước hôm nay
                                if (source !== "date") return; // Chỉ xử lý khi chọn ngày từ lịch
                                setSelectedDate(date);
                                setIsModalOpen(true);
                            }}
                            onPanelChange={(date) => setCalendarDate(date)} // Chỉ thay đổi nếu chuyển tháng hoặc năm
                        />
                    </div>

                    {/* Chế độ Ngày (ẩn trên desktop) */}
                    <div className="sm:hidden">
                        <CalendarDayView
                            timesheets={timesheets}
                            events={events}
                            form={form}
                            selectedDate={selectedDate}
                            setIsModalOpen={setIsModalOpen}
                            setSelectedEvent={setSelectedEvent}
                            setSelectedDate={setSelectedDate}
                            setTimesheets={setTimesheets}
                        />
                    </div>

                    <EventModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        selectedDate={selectedDate}
                        selectedEvent={selectedEvent}
                        form={form}
                        setIsModalOpen={setIsModalOpen}
                        setSelectedEvent={setSelectedEvent}
                        classes={classes}
                        setTimesheets={setTimesheets}
                    />
                </>
            )}
        </>
    );
};

export default CalendarPage;
