"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Form } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import EventModal from "@/components/Calendar/Event/EventModal";
import EventList from "@/components/Calendar/Event/EventList";
import { ITimesheet } from "@/types/timesheet";
import { getTimesheets } from "@/actions/timesheet.actions";
import { getClasses } from "@/actions/class.actions";
import { IClass } from "@/types/class";

const CalendarPage: React.FC = () => {
    const [events, setEvents] = useState<Record<string, { id: number, type: string; content: string }[]>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [timesheets, setTimesheets] = useState<ITimesheet[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ITimesheet | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchDataTimeSheets = async () => {
            const timesheetRes = await getTimesheets();
            if (timesheetRes.ok)
                setTimesheets(timesheetRes.data);
        };
        const fetchDataClasses = async () => {
            const classRes = await getClasses();
            if (classRes.ok)
                setClasses(classRes.data);
        };
        fetchDataTimeSheets();
        fetchDataClasses();
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
            formattedEvents[dateStr].push({ id: id, type: status, content: nameClass });
        });
        setEvents({ ...formattedEvents })
    }, [timesheets, classes]);

    // Giữ nguyên ngày hiển thị khi bấm vào model và close không bị di chuyển
    const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs());
    return (
        <>
            <Calendar
                value={calendarDate} // Giữ nguyên ngày hiển thị
                dateCellRender={(value) => <EventList
                    timesheets={timesheets}
                    value={value}
                    events={events}
                    form={form}
                    setIsModalOpen={setIsModalOpen}
                    setSelectedEvent={setSelectedEvent}
                    setSelectedDate={setSelectedDate}
                />}
                onSelect={(date, { source }) => {
                    if (source !== "date") return; // Chỉ xử lý khi chọn ngày từ lịch
                    setSelectedDate(date);
                    setIsModalOpen(true);
                }}
                onPanelChange={(date) => {
                    setCalendarDate(date); // Chỉ thay đổi nếu chuyển tháng hoặc năm
                }}
            />

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
    );
};

export default CalendarPage;
