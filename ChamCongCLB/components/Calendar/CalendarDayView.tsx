'use client';

import React, { useState } from 'react';
import { Button, Calendar, Dropdown } from 'antd';
import { ITimesheet } from '@/types/timesheet';
import dayjs, { Dayjs } from 'dayjs';
import EventListMobile from './Event/EventListMobile';
import { DownOutlined } from '@ant-design/icons';

interface Props {
    events: Record<string, { id: number; type: string; content: string }[]>;
    timesheets: ITimesheet[];
    form: unknown;
    selectedDate: Dayjs | null;
    setIsModalOpen: (isOpen: boolean) => void;
    setSelectedEvent: (event: ITimesheet | null) => void;
    setTimesheets: (timesheets: ITimesheet[]) => void;
    setSelectedDate: (date: Dayjs | null) => void;
}

const CalendarDayView: React.FC<Props> = ({
    events,
    timesheets,
    form,
    selectedDate,
    setIsModalOpen,
    setSelectedEvent,
    setSelectedDate,
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

    return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
            <div className="flex justify-between items-center w-full gap-2 md:gap-4">
                <Button onClick={handlePrevDay} className="text-sm px-2 md:px-4">← Ngày trước</Button>
                <Dropdown
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                    overlay={
                        <div className="w-72 bg-white shadow-lg rounded-lg">
                            <Calendar
                                fullscreen={false}
                                onSelect={(date) => {
                                    setSelectedDate(date);
                                    setIsCalendarOpen(false);
                                }}
                            />
                        </div>
                    }
                    trigger={["click"]}
                    placement="bottomCenter"
                >
                    <button className="text-sm font-semibold flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 border rounded-md" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                        {selectedDate ? selectedDate.format("DD/MM/YYYY") : "Chưa chọn ngày"} <DownOutlined />
                    </button>
                </Dropdown>
                <Button onClick={handleNextDay} className="text-sm px-2 md:px-4">Ngày sau →</Button>
            </div>

            <Button onClick={() => setIsModalOpen(true)} className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md md:w-auto md:px-6">
                Thêm sự kiện
            </Button>

            {selectedDate && (
                <EventListMobile
                    timesheets={timesheets}
                    value={selectedDate}
                    events={events}
                    form={form}
                    setIsModalOpen={setIsModalOpen}
                    setSelectedEvent={setSelectedEvent}
                    setSelectedDate={setSelectedDate}
                />
            )}
        </div>
    );
};

export default CalendarDayView;
