import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button, SelectProps, Upload, message } from "antd";
import type { Dayjs } from "dayjs";
import { ITimesheet, ITimesheetCreate, ITimesheetUpdate } from "@/types/timesheet";
import { IStudent } from "@/types/student";
import { IClass } from "@/types/class";

import { getAllStudents } from "@/actions/student.actions";
import { createTimesheet, deleteTimesheet, getTimesheets, updateTimesheet } from "@/actions/timesheet.actions";
import { UploadOutlined } from "@ant-design/icons";
import heic2any from "heic2any";
import LoadingScreen from "@/components/ui/Loading/LoadingScreen";

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
        const loadingMessage = message.loading('Đang thêm chấm công ...', 0);
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
            setIsLoading(true)
            const response = await createTimesheet(newTimesheet)

            if (response.ok) {
                const list = await getTimesheets()
                if (list.ok) setTimesheets(list.data)
                loadingMessage()
                setIsModalOpen(false)
                form.resetFields()
                message.success("Thêm mới chấm công thành công!")
            }
            else
                message.error("Thêm mới chấm công thất bại!")

            setIsLoading(false)
        } catch (error) {
            loadingMessage();
            console.error("Error adding event:", error)
            message.error("Có lỗi xảy ra khi thêm mới chấm công!")
        }
    }

    const handleSaveEvent = async () => {
        const loadingMessage = message.loading('Đang cập nhật chấm công ....', 0);

        try {
            const values = await form.validateFields();
            if (!selectedDate) return;
            const file = values.imageBase64?.[0]?.originFileObj;
            // let imageBase64 = null;

            // if (file instanceof File) {
            //     // Nếu là File mới được upload thì chuyển sang base64
            //     imageBase64 = await fileToBase64(file);
            // } else {
            //     // Nếu không có file mới, giữ nguyên ảnh cũ (nếu có)
            //     imageBase64 = selectedEvent?.imageBase64 || '';
            // }

            const imageBase64 = file ? await fileToBase64(file) : selectedEvent?.imageBase64;
            if (selectedEvent) {
                const updatedTimesheet: ITimesheetUpdate = {
                    id: selectedEvent.id,
                    studentsId: values.studentsId,
                    classId: values.classId,
                    timeId: values.timeId,
                    date: selectedDate.format("YYYY-MM-DD"),
                    imageBase64: imageBase64,
                    note: values.note || "",
                    status: selectedEvent.status,
                };
                setIsLoading(true);
                const response = await updateTimesheet(updatedTimesheet);
                loadingMessage();
                if (response.ok) {
                    const responseTimesheets = await getTimesheets();
                    if (responseTimesheets.ok) setTimesheets(responseTimesheets.data);
                    message.success("Cập nhật chấm công thành công!");
                }
                else {
                    message.error("Cập nhật chấm công thất bại!");
                }
                setIsLoading(false);
            }

            setIsModalOpen(false);
            form.resetFields();
            setSelectedEvent(null);
        } catch (error) {
            loadingMessage();
            console.error("Error saving event:", error);
            message.error("Có lỗi xảy ra khi lưu chấm công!");
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
                message.success("Xóa buổi điểm danh thành công!");
            }
            setIsModalOpen(false);
            form.resetFields();
            setSelectedEvent(null);
        }
        catch (error) {
            console.error("Error deleting event:", error);
            message.error("Có lỗi xảy ra khi xóa buổi điểm danh!");
        }
    }

    const options: SelectProps['options'] = [];

    students.forEach((student) => {
        options.push({
            value: student.id,
            label: `${student.lastName} ${student.firstName} (${student.maSinhVien?.toUpperCase()})`,
        });
    });

    const fileToBase64 = async (file: File): Promise<string> => {
        let finalFile = file;

        // 1. Convert HEIC → JPEG nếu cần
        if (file.name.toLowerCase().endsWith('.heic')) {
            const converted = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8,
            });
            finalFile = converted as File;
        }

        // 2. Resize & Compress ảnh nếu kích thước lớn hơn 1MB
        // const compressedBlob = await compressImageToUnder1MB(finalFile);
        // finalFile = new File([compressedBlob], finalFile.name, { type: compressedBlob.type });

        // 3. Convert to Base64
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(finalFile);
        });
    };

    // const compressImageToUnder1MB = async (file: File): Promise<Blob> => {
    //     const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    //         const image = new Image();
    //         image.onload = () => resolve(image);
    //         image.onerror = reject;
    //         image.src = URL.createObjectURL(file);
    //     });

    //     const canvas = document.createElement('canvas');
    //     const MAX_WIDTH = 1024;

    //     const scale = Math.min(1, MAX_WIDTH / img.width);
    //     canvas.width = img.width * scale;
    //     canvas.height = img.height * scale;

    //     const ctx = canvas.getContext('2d');
    //     ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

    //     let quality = 0.9;
    //     let blob: Blob | null = null;

    //     do {
    //         blob = await new Promise(resolve =>
    //             canvas.toBlob(
    //                 b => resolve(b),
    //                 'image/jpeg',
    //                 quality,
    //             ),
    //         );
    //         quality -= 0.05;
    //     } while (blob && blob.size > 1024 * 1024 && quality > 0.1);

    //     return blob!;
    // };


    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
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
                    {isLoading && <LoadingScreen spinning={isLoading} />}
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
                        // getValueFromEvent={(e) => Array.isArray(e?.fileList) ? e.fileList : []}
                        rules={[{ required: !form.getFieldValue('imageBase64'), message: 'Vui lòng chọn hình ảnh điểm danh' }]}>

                        {form.getFieldValue('imageBase64')?.length > 0 && (
                            <div style={{ position: 'relative', width: '350px', height: 'auto' }}>
                                <img
                                    src={`http://xtcoder2004.io.vn:5000/extension/image?nameFile=${form.getFieldValue('imageBase64')}`}
                                    alt="Hình ảnh điểm danh"
                                    style={{ width: '350px', height: 'auto', marginBottom: '10px' }}
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <Upload
                            name="imageBase64"
                            listType="picture"
                            accept="image/*"
                            beforeUpload={() => false} // Prevent auto upload
                            maxCount={1}
                            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                            onChange={(info) => {
                                const fileList = Array.isArray(info.fileList) ? info.fileList : [];
                                if (fileList.length > 0) {
                                    form.setFieldsValue({ imageBase64: fileList });
                                    message.success(`Tải lên hình ảnh thành công`);
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
        </>

    );
};

export default EventModal;
