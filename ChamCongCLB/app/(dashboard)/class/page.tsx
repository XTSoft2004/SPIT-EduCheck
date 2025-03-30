'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip, Select, MenuItem } from '@mui/material';
import { getClasses, createClass, updateClass, deleteClass } from '@/actions/class.actions';
import { getAllStudents } from '@/actions/student.actions';
import { IClass, IClassCreate, IClassUpdate } from '@/types/class';
import { IStudent } from '@/types/student';

export default function ClassPage() {
    const [classes, setClasses] = useState<IClass[]>([]);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [newStudent, setNewStudent] = useState<string>('');
    const [selectedStudents, setSelectedStudents] = useState<IStudent[]>([]);

    useEffect(() => {
        fetchClasses();
        fetchStudents();
    }, [page, pageSize]);

    const fetchClasses = async () => {
        const response = await getClasses();
        if (response.ok) {
            setClasses(response.data);
        }
    };

    const fetchStudents = async () => {
        const response = await getAllStudents();
        if (response.ok) {
            setStudents(response.data);
        }
    };

    const handleAdd = () => {
        setSelectedClass({ id: 0, code: '', name: '', day: 0, timeStart: '', timeEnd: '', lecturerId: '', courseId: '', studentsId: [] });
        setOpen(true);
    };

    const handleEdit = (classData: IClass) => {
        setSelectedClass(classData);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteClass(id);
        fetchClasses();
    };

    const handleSave = async () => {
        if (selectedClass) {
            if (selectedClass.id === 0) {
                const newClass: IClassCreate = { ...selectedClass, studentsId: selectedClass.studentsId || [] };
                await createClass(newClass);
            } else {
                const updatedClass: IClassUpdate = { ...selectedClass };
                updatedClass.timeStart = selectedClass.timeStart.slice(0, 5);
                updatedClass.timeEnd = selectedClass.timeEnd.slice(0, 5);
                await updateClass(updatedClass);
            }
            fetchClasses();
            setOpen(false);
        }
    };

    const handleAddStudent = () => {
        if (newStudent) {
            const student = students.find(s => s.id === Number(newStudent));
            if (student) {
                setSelectedClass({ ...selectedClass!, studentsId: [...selectedClass!.studentsId, student.id] });
            }
            setNewStudent('');
        }
    };

    const handleDeleteStudent = (index: number) => {
        setSelectedClass({ ...selectedClass!, studentsId: selectedClass!.studentsId.filter((_, i) => i !== index) });
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'code', headerName: 'Code', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'day', headerName: 'Day', width: 50 },
        { field: 'timeStart', headerName: 'Start Time', width: 90 },
        { field: 'timeEnd', headerName: 'End Time', width: 90 },
        { field: 'lecturerId', headerName: 'Lecturer ID', width: 90 },
        { field: 'courseId', headerName: 'Course ID', width: 90 },
        {
            field: 'studentsId',
            headerName: 'Student Names',
            width: 200,
            renderCell: (params) => {
                const studentList = params.value ?? [];
                const studentNames = studentList.map((id: number) => {
                    const student = students.find(s => s.id === (id as unknown as number));
                    return student ? student.firstName + ' ' + student.lastName : id;
                });
                return (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {studentNames.slice(0, 3).map((name: string, index: number) => (
                            <Chip key={index} label={name} size="small" />
                        ))}
                        {studentNames.length > 3 && <span>+{studentNames.length - 3} more</span>}
                    </div>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button onClick={() => handleEdit(params.row)}>Edit</Button>
                    <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ height: 700, width: '100%' }}>
            <Button onClick={handleAdd}>Add Class</Button>
            <DataGrid
                rows={classes}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                pagination
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(newModel) => {
                    setPage(newModel.page ?? 0);
                    setPageSize(newModel.pageSize ?? pageSize);
                }}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{
                    toolbar: GridToolbar,
                }}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{selectedClass?.id === 0 ? 'Add Class' : 'Edit Class'}</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Code" fullWidth value={selectedClass?.code || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, code: e.target.value })} />
                    <TextField margin="dense" label="Name" fullWidth value={selectedClass?.name || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, name: e.target.value })} />
                    <TextField margin="dense" label="Day" type="number" fullWidth value={selectedClass?.day || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, day: Number(e.target.value) })} />
                    <TextField margin="dense" label="Start Time" type="time" fullWidth value={selectedClass?.timeStart || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, timeStart: e.target.value })} />
                    <TextField margin="dense" label="End Time" type="time" fullWidth value={selectedClass?.timeEnd || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, timeEnd: e.target.value })} />
                    <TextField margin="dense" label="Lecturer ID" fullWidth value={selectedClass?.lecturerId || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, lecturerId: e.target.value })} />
                    <TextField margin="dense" label="Course ID" fullWidth value={selectedClass?.courseId || ''} onChange={(e) => setSelectedClass({ ...selectedClass!, courseId: e.target.value })} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 10 }}>
                        {(selectedClass?.studentsId ?? []).map((id, index) => {
                            const student = students.find(s => s.id === (id as number));
                            return (
                                <Chip key={index} label={student ? student.firstName + ' ' + student.lastName : id} onDelete={() => handleDeleteStudent(index)} />
                            );
                        })}
                        <Select
                            fullWidth
                            multiple
                            value={selectedStudents}
                            onChange={(e) => setSelectedStudents(e.target.value as IStudent[])}
                            renderValue={(selected = []) => selected.map(id => {
                                const student = students.find(s => s.id === (id as unknown as number));
                                return student ? student.firstName + ' ' + student.lastName : id;
                            }).join(', ')}
                        >
                            {students.map(student => (
                                <MenuItem key={student.id} value={student.id}>
                                    {student.firstName + ' ' + student.lastName} ({student.maSinhVien})
                                </MenuItem>
                            ))}
                        </Select>
                        <Button onClick={handleAddStudent}>Add Student</Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};