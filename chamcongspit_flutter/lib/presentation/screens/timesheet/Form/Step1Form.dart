import 'package:animated_custom_dropdown/custom_dropdown.dart';
import 'package:chamcongspit_flutter/data/models/class/ClassResponse.dart';
import 'package:chamcongspit_flutter/data/models/student/StudentResponse.dart';
import 'package:chamcongspit_flutter/data/models/time/TimeRequest.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetRequest.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/Form/timesheet_form.dart';
import 'package:chamcongspit_flutter/widgets/dropdown/dropdown_search.dart';
import 'package:chamcongspit_flutter/widgets/dropdown/multi_select_search_dropdown.dart';
import 'package:flutter/material.dart';

class FormSection extends StatelessWidget {
  final String title;
  final Widget child;

  const FormSection({super.key, required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        child,
        const SizedBox(height: 8),
      ],
    );
  }
}

class Step1Form extends StatefulWidget {
  final TimesheetRequest timesheetRequest;
  final InfoTimesheet timesheetInfo;

  const Step1Form({
    super.key,
    required this.timesheetRequest,
    required this.timesheetInfo,
  });

  @override
  State<Step1Form> createState() => _Step1FormState();
}

class _Step1FormState extends State<Step1Form> {
  DateTime? selectedDate;
  List<TimeRequest> TimesRequest = [
    TimeRequest(id: 1, name: 'Sáng'),
    TimeRequest(id: 2, name: 'Chiều'),
    TimeRequest(id: 3, name: 'Tối'),
  ];

  @override
  void initState() {
    super.initState();
    selectedDate = DateTime.now();
    widget.timesheetRequest.date = Date(
      day: selectedDate!.day,
      month: selectedDate!.month,
      year: selectedDate!.year,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        FormSection(
          title: 'Danh sách sinh viên hỗ trợ',
          child: MultiSelectSearchDropdown<StudentResponse>(
            initialItems:
                widget.timesheetRequest.studentsId
                    ?.map(
                      (id) => widget.timesheetInfo.studentList.firstWhere(
                        (student) => student.id == id,
                        orElse: () => StudentResponse(),
                      ),
                    )
                    .toList() ??
                [],
            hintText: 'Chọn các sinh viên hỗ trợ',
            searchHintText: 'Tìm kiếm sinh viên',
            items: widget.timesheetInfo.studentList,
            onListChanged: (value) {
              final selectedIds =
                  value.map((student) => student.id ?? '').toList();

              final selectStudent =
                  widget.timesheetInfo.studentList
                      .where((student) => selectedIds.contains(student.id))
                      .toList();

              widget.timesheetRequest.studentsId =
                  selectStudent
                      .map((student) => student.id)
                      .whereType<int>()
                      .toList();

              debugPrint('Selected Student IDs: $selectedIds');
            },
          ),
        ),

        FormSection(
          title: 'Danh sách lớp hỗ trợ',
          child: SearchDropdown<ClassResponse>(
            initialItem: widget.timesheetInfo.classList.firstWhere(
              (classResponse) =>
                  classResponse.id == widget.timesheetRequest.classId,
              orElse: () => ClassResponse(),
            ),
            hintText: 'Chọn các lớp hỗ trợ',
            searchHintText: 'Tìm kiếm lớp',
            items: widget.timesheetInfo.classList,
            onChanged: (value) {
              widget.timesheetRequest.classId = value?.id;
              debugPrint('Selected Class: ${value?.name}');
            },
          ),
        ),

        FormSection(
          title: 'Chọn buổi',
          child: SearchDropdown<TimeRequest>(
            initialItem: TimesRequest.firstWhere(
              (timeRequest) => timeRequest.id == widget.timesheetRequest.timeId,
              orElse: () => TimeRequest(),
            ),
            hintText: 'Chọn buổi hỗ trợ',
            searchHintText: 'Tìm kiếm lớp',
            items: TimesRequest,
            onChanged: (value) {
              widget.timesheetRequest.timeId = value?.id;
              debugPrint('Select : ${value?.name}');
            },
          ),
        ),

        FormSection(
          title: 'Chọn ngày:',
          child: GestureDetector(
            onTap: () async {
              final pickedDate = await showDatePicker(
                context: context,
                initialDate: selectedDate ?? DateTime.now(),
                firstDate: DateTime(2000),
                lastDate: DateTime(2100),
              );
              if (pickedDate != null) {
                setState(() {
                  selectedDate = pickedDate;
                  widget.timesheetRequest.date = Date(
                    day: pickedDate.day,
                    month: pickedDate.month,
                    year: pickedDate.year,
                  );
                });
                debugPrint('Selected Date: $selectedDate');
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    selectedDate != null
                        ? '${selectedDate!.day}/${selectedDate!.month}/${selectedDate!.year}'
                        : '${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const Icon(Icons.calendar_today),
                ],
              ),
            ),
          ),
        ),

        FormSection(
          title: 'Ghi chú',
          child: TextField(
            maxLines: 5,
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: Colors.grey),
              ),
              hintText: 'Nhập ghi chú',
            ),
            onChanged: (value) {
              widget.timesheetRequest.note = value;
            },
          ),
        ),
      ],
    );
  }
}
