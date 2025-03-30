import React from "react";
import { Button } from "antd";
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

const EventListMobile: React.FC<Props> = ({ value, events, timesheets, form, setIsModalOpen, setSelectedEvent, setSelectedDate }) => {
    const dateStr = value.format("DD/MM/YYYY");
    return (
        <div className={`${styles.events} flex flex-col gap-4 w-full`}>
            {events[dateStr]?.length ? (
                events[dateStr].map((item, index) => {
                    const event = timesheets.find((t) => t.id === item.id);

                    return (
                        <Button
                            key={index}
                            className={`${styles.eventButton} dark:bg-[#242f45] dark:text-white border-l-4 w-full text-left text-2xl py-4 px-6 rounded-lg shadow-md shadow-gray-700 transition-transform active:scale-95`}
                            style={{
                                borderLeftColor:
                                    item.type === "success" ? "#52c41a" :
                                        item.type === "warning" ? "#faad14" :
                                            "#ff4d4f",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (event) {
                                    setSelectedEvent(event);
                                    (form as any).setFieldsValue({
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
                            <span className="block max-w-full truncate whitespace-nowrap text-sm">
                                {item.content.split(" - ")[1] + " - " + item.content.split(" - ")[0]}
                            </span>
                        </Button>
                    );
                })
            ) : (
                <div className="w-full text-center text-gray-900 dark:text-gray-500">
                    Không có dữ liệu
                </div>
            )}
        </div>
    );
};

export default EventListMobile;
