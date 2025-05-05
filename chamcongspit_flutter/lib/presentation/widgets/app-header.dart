import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/models/semester/SemesterResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/SemesterRepositories.dart';
import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
import 'package:chamcongspit_flutter/widgets/slide_alert.dart';
import 'package:flutter/material.dart';
import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:get/get.dart';

class AppHeader extends StatefulWidget {
  const AppHeader({super.key});

  @override
  State<AppHeader> createState() => _AppHeaderState();
}

class _AppHeaderState extends State<AppHeader> {
  String selectedSemester = '-1';

  final SemesterRepositories semesterRepositories = SemesterRepositories();
  final UserRespositories userRespositories = UserRespositories();
  final SecureStorageService storage = SecureStorageService();

  List<SemesterResponse>? semesterList = [];

  @override
  void initState() {
    super.initState();
    loadSemesters();
  }

  Future<void> loadSemesters() async {
    String? storedSemester = await storage.getValue('semesterId');
    var response = await semesterRepositories.AllSemester();

    if (response.data != null && mounted) {
      setState(() {
        semesterList = response.data;
        selectedSemester =
            storedSemester != null &&
                    response.data!.any((s) => s.id.toString() == storedSemester)
                ? storedSemester
                : response.data!.first.id.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentRoute = Get.currentRoute;

    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 1),
        child:
            (semesterList != null && semesterList!.isNotEmpty)
                ? DropdownButtonHideUnderline(
                  child: DropdownButton2<String>(
                    isExpanded: true,
                    value: selectedSemester,
                    items:
                        semesterList!.map((SemesterResponse value) {
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
                    onChanged: (String? newValue) async {
                      if (newValue != null && newValue != selectedSemester) {
                        setState(() {
                          selectedSemester = newValue;
                        });

                        bool success = await userRespositories.setSemester(
                          selectedSemester,
                        );

                        SlideAlert.show(
                          context,
                          message:
                              success
                                  ? 'Học kỳ đã được thay đổi thành công!'
                                  : 'Thay đổi học kỳ thất bại!',
                          type:
                              success
                                  ? SlideAlertType.success
                                  : SlideAlertType.error,
                          duration: const Duration(seconds: 2),
                        );

                        // Reload the app by navigating to the initial route
                        Navigator.of(context).pushNamedAndRemoveUntil(
                          currentRoute,
                          (Route<dynamic> route) => false,
                        );
                      }
                    },
                    buttonStyleData: ButtonStyleData(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      height: 50,
                      overlayColor: WidgetStateProperty.all(Colors.transparent),
                    ),
                    dropdownStyleData: DropdownStyleData(
                      maxHeight: 200,
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
                )
                : const Text(
                  'Không có học kỳ nào',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
      ),
    );
  }
}
