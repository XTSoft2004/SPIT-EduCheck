import React from "react";
import { Button, Form } from "antd";
import styles from "./EventList.module.css";
import { ITimesheet } from "@/types/timesheet";
import dayjs, { Dayjs } from "dayjs";

interface Props {
    value: any;
    events: Record<string, { id: number, type: string; content: string }[]>;
    timesheets: ITimesheet[];
    form: any;
    setIsModalOpen: (isOpen: boolean) => void;
    setSelectedEvent: (isOpen: ITimesheet | null) => void;
    setSelectedDate: (date: Dayjs | null) => void;
}

const EventList: React.FC<Props> = ({ value, events, timesheets, form, setIsModalOpen, setSelectedEvent, setSelectedDate }) => {
    const dateStr = value.format("DD/MM/YYYY");
    return (
        <div className={styles.events}>
            {events[dateStr]?.map((item, index) => {
                // Lấy thông tin sự kiện từ timesheets dựa trên id
                const event = timesheets.find((t) => t.id === item.id);

                return (
                    <>
                        <Button key={index} className={`${styles.eventButton} dark:text-white`}
                            style={{ borderLeftColor: item.type === "success" ? "#52c41a" : item.type === "warning" ? "#faad14" : "#ff4d4f" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (event) {
                                    setSelectedEvent(event);
                                    form.setFieldsValue({
                                        studentsId: event.studentsId,
                                        classId: event.classId,
                                        timeId: event.timeId,
                                        image_Check: event.image_Check,
                                        note: event.note,
                                    });
                                    setIsModalOpen(true);
                                    setSelectedDate(dayjs(event.date.toString()));
                                }
                            }}
                        >
                            {item.content}
                        </Button>
                    </>
                )
            })}
        </div>
    );
};

export default EventList;
