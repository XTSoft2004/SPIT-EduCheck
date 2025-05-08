import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetRequest.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/Form/timesheet_form.dart';
import 'package:flutter/material.dart';

class Step3Form extends StatefulWidget {
  final TimesheetRequest timesheetRequest;
  final InfoTimesheet timesheetInfo;

  const Step3Form({
    super.key,
    required this.timesheetRequest,
    required this.timesheetInfo,
  });

  @override
  State<Step3Form> createState() => _Step3FormState();
}

class _Step3FormState extends State<Step3Form> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 10),
        TextFormField(
          initialValue:
              widget.timesheetRequest.studentsId
                  ?.map((id) {
                    final student = widget.timesheetInfo.studentList.firstWhere(
                      (student) => student.id == id,
                    );
                    return '${student.firstName} ${student.lastName}';
                  })
                  .join(', ') ??
              'Không có sinh viên nào hỗ trợ',
          decoration: const InputDecoration(
            labelText: 'Các sinh viên hỗ trợ:',
            border: OutlineInputBorder(),
          ),
          enabled: false,
        ),
        const SizedBox(height: 16),
        TextFormField(
          initialValue:
              widget.timesheetRequest.classId != null
                  ? widget.timesheetInfo.classList
                      .firstWhere(
                        (classResponse) =>
                            classResponse.id == widget.timesheetRequest.classId,
                      )
                      .name
                  : 'Không có lớp nào hỗ trợ',
          decoration: const InputDecoration(
            labelText: 'Lớp hỗ trợ:',
            border: OutlineInputBorder(),
          ),
          enabled: false,
        ),
        const SizedBox(height: 16),
        TextFormField(
          initialValue: widget.timesheetRequest.date.toString(),
          decoration: const InputDecoration(
            labelText: 'Ngày hỗ trợ:',
            border: OutlineInputBorder(),
          ),
          enabled: false,
        ),
        const SizedBox(height: 16),
        TextFormField(
          initialValue:
              widget.timesheetRequest.timeId != null
                  ? widget.timesheetRequest.timeId == 0
                      ? 'Sáng'
                      : widget.timesheetRequest.timeId == 1
                      ? 'Chiều'
                      : 'Tối'
                  : 'Không xác định',
          decoration: const InputDecoration(
            labelText: 'Thời gian hỗ trợ:',
            border: OutlineInputBorder(),
          ),
          enabled: false,
        ),
        const SizedBox(height: 16),
        TextFormField(
          maxLines: 3,
          initialValue: widget.timesheetRequest.note ?? 'Không có ghi chú',
          decoration: const InputDecoration(
            labelText: 'Ghi chú:',
            border: OutlineInputBorder(),
          ),
          enabled: false,
        ),
        const SizedBox(height: 16),
        if (widget.timesheetInfo.imageFile != null)
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Hình ảnh đã tải lên:',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 8),
              Image.file(
                widget.timesheetInfo.imageFile!,
                width: 200,
                height: 200,
                fit: BoxFit.cover,
              ),
            ],
          ),
      ],
    );
  }
}
