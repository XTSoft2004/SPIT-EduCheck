import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/semester/SemesterResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/SemesterRepositories.dart';
import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
import 'package:chamcongspit_flutter/widgets/slide_alert.dart';
import 'package:flutter/material.dart';
import 'package:dropdown_button2/dropdown_button2.dart';

class AppHeader extends StatefulWidget {
  const AppHeader({super.key});

  @override
  State<AppHeader> createState() => _AppHeaderState();
}

class _AppHeaderState extends State<AppHeader> {
  String selectedSemester = '-1';

  SemesterRepositories semesterRepositories = SemesterRepositories();
  UserRespositories userRespositories = UserRespositories();

  // Dữ liệu học kỳ
  List<SemesterResponse>? semesterList = [];
  SecureStorageService storage = SecureStorageService();
  @override
  void initState() {
    super.initState();
    loadSemesters();
  }

  void loadSemesters() async {
    selectedSemester = await storage.getValue('semesterId') ?? '-1';

    var response = await semesterRepositories.AllSemester();
    if (response.data != null) {
      setState(() {
        semesterList = response.data;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 1),
        child: DropdownButtonHideUnderline(
          child: DropdownButton2<String>(
            isExpanded: true,
            value:
                (semesterList?.isEmpty ?? true)
                    ? 'Không xác định'
                    : selectedSemester,
            items:
                (semesterList ?? []).map((SemesterResponse value) {
                  return DropdownMenuItem<String>(
                    value: value.id.toString(),
                    child: Center(
                      child: Column(
                        children: [
                          Text(
                            'Học kỳ: ${value.semestersNumber}',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            'Năm học: ${value.yearStart} - ${value.yearEnd}',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w200,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  selectedSemester = newValue;
                });
                userRespositories.setSemester(selectedSemester).then((success) {
                  if (success) {
                    SlideAlert.show(
                      context,
                      message: 'Học kỳ đã được thay đổi thành công!',
                      type: SlideAlertType.success,
                      duration: const Duration(seconds: 2),
                    );
                  } else {
                    SlideAlert.show(
                      context,
                      message: 'Thay đổi học kỳ thất bại!',
                      type: SlideAlertType.error,
                      duration: const Duration(seconds: 2),
                    );
                  }
                });
              }
            },
            buttonStyleData: ButtonStyleData(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              height: 50,
              overlayColor: WidgetStateProperty.all(
                Colors.transparent,
              ), // Tắt hiệu ứng nhấp
            ),

            dropdownStyleData: DropdownStyleData(
              maxHeight: 200, // tối đa 5 item * height
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                color: Colors.white,
              ),
              scrollbarTheme: ScrollbarThemeData(
                radius: const Radius.circular(40),
                thickness: WidgetStateProperty.all(6),
                thumbVisibility: WidgetStateProperty.all(true),
              ),
            ),
            iconStyleData: const IconStyleData(icon: SizedBox.shrink()),
          ),
        ),
      ),
    );
  }
}
