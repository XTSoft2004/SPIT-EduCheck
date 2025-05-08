import 'dart:io';

import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/class/ClassResponse.dart';
import 'package:chamcongspit_flutter/data/models/student/StudentResponse.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetRequest.dart';
import 'package:chamcongspit_flutter/data/repositories/ClassRespositories.dart';
import 'package:chamcongspit_flutter/data/repositories/StudentResponsitories.dart';
import 'package:chamcongspit_flutter/data/repositories/TimesheetRespositories.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/Form/Step1Form.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/Form/Step2Form.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/Form/Step3Form.dart';
import 'package:chamcongspit_flutter/routers/app_router.dart';
import 'package:chamcongspit_flutter/widgets/slide_alert.dart';
import 'package:flutter/material.dart';

class TimesheetForm extends StatefulWidget {
  @override
  State<TimesheetForm> createState() => _TimesheetFormState();
}

class InfoTimesheet {
  List<ClassResponse> classList = [];
  List<StudentResponse> studentList = [];
  File? imageFile;
}

class _TimesheetFormState extends State<TimesheetForm> {
  ClassResponsitories classResponsitories = ClassResponsitories();
  StudentResponsitories studentResponsitories = StudentResponsitories();
  TimesheetRespositories timesheetRespositories = TimesheetRespositories();
  InfoTimesheet infoTimesheet = InfoTimesheet();

  @override
  void initState() {
    super.initState();
    classResponsitories.getClass().then((classResponse) {
      setState(() {
        infoTimesheet.classList = classResponse.data!;
      });
    });

    studentResponsitories.getStudent().then((studentResponse) {
      setState(() {
        infoTimesheet.studentList = studentResponse.data!;
      });
    });
  }

  int _currentStep = 0;

  Widget _buildProgressIndicator() {
    List<String> steps = [
      'Thông tin chấm công',
      'Hình ảnh chứng minh',
      'Kiểm tra thông tin chấm công',
    ];
    return Row(
      children: List.generate(steps.length, (index) {
        final isActive = index == _currentStep;
        final isCompleted = index < _currentStep;

        return Expanded(
          child: Column(
            children: [
              Text(
                steps[index],
                textAlign: TextAlign.center,
                style: TextStyle(
                  color:
                      isActive
                          ? Colors.green
                          : isCompleted
                          ? Colors.black
                          : Colors.grey,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                ),
              ),
              SizedBox(height: 5),
              AnimatedContainer(
                duration: Duration(milliseconds: 400),
                height: 4,
                margin: EdgeInsets.symmetric(horizontal: 4), // Add spacing
                decoration: BoxDecoration(
                  color:
                      isActive || isCompleted ? Colors.green : Colors.grey[300],
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildBottomStep() {
    void _handlePreviousStep() {
      if (_currentStep > 0) {
        setState(() {
          _currentStep--;
        });
      }
    }

    void _handleNextStep() {
      if (DateTime.parse(
        timesheetRequest.date!.toString(),
      ).isAfter(DateTime.now().toUtc())) {
        SlideAlert.show(
          context,
          message: 'Ngày chấm công không được lớn hơn ngày hiện tại!',
          type: SlideAlertType.warning,
          duration: Duration(seconds: 2),
        );
        return;
      }
      if (!isCheckStep()) {
        SlideAlert.show(
          context,
          message: 'Vui lòng điền đầy đủ thông tin!',
          type: SlideAlertType.warning,
          duration: Duration(seconds: 2),
        );
        return;
      }
      if (_currentStep < 2) {
        setState(() {
          _currentStep++;
        });
      }
    }

    void _showSubmitTimesheet() async {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return Center(child: CircularProgressIndicator());
        },
      );

      BaseResponse response = await timesheetRespositories.createTimesheet(
        timesheetRequest,
      );

      Navigator.pop(context); // Close the loading dialog

      if (response.ok!) {
        if (mounted) {
          SlideAlert.show(
            context,
            message: 'Chấm công thành công!',
            type: SlideAlertType.success,
            duration: Duration(seconds: 2),
          );
          Navigator.pushNamedAndRemoveUntil(
            context,
            AppRoutes.calendar,
            (Route<dynamic> route) => false, // Remove all previous routes
          );
        }
      } else {
        if (mounted) {
          SlideAlert.show(
            context,
            message: response.message!,
            type: SlideAlertType.error,
            duration: Duration(seconds: 2),
          );
        }
      }
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        ElevatedButton.icon(
          onPressed: _currentStep > 0 ? _handlePreviousStep : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.grey[800],
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          icon: Icon(Icons.arrow_back, color: Colors.white),
          label: Text('Trở lại', style: TextStyle(color: Colors.white)),
        ),
        if (_currentStep == 2)
          ElevatedButton.icon(
            onPressed: _showSubmitTimesheet,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            icon: Icon(Icons.check, color: Colors.white),
            label: Text('Xác nhận', style: TextStyle(color: Colors.white)),
          )
        else
          ElevatedButton.icon(
            onPressed: _handleNextStep,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            icon: Icon(Icons.arrow_forward, color: Colors.white),
            label: Text('Tiếp theo', style: TextStyle(color: Colors.white)),
          ),
      ],
    );
  }

  final TimesheetRequest timesheetRequest = TimesheetRequest();

  Widget _buildStepContent() {
    Widget content;
    switch (_currentStep) {
      case 0:
        content = Step1Form(
          timesheetRequest: timesheetRequest,
          timesheetInfo: infoTimesheet,
        );
        break;
      case 1:
        content = Step2Form(
          timesheetRequest: timesheetRequest,
          timesheetInfo: infoTimesheet,
        );
        break;
      case 2:
        content = Step3Form(
          timesheetRequest: timesheetRequest,
          timesheetInfo: infoTimesheet,
        );
        break;
      default:
        content = Container();
    }

    return AnimatedSwitcher(
      duration: Duration(milliseconds: 500),
      transitionBuilder:
          (child, animation) => ScaleTransition(
            scale: CurvedAnimation(parent: animation, curve: Curves.easeInOut),
            child: FadeTransition(opacity: animation, child: child),
          ),
      child: content,
    );
  }

  bool isCheckStep() {
    if (_currentStep == 0) {
      if ((timesheetRequest.studentsId?.isEmpty ?? true) ||
          (timesheetRequest.classId == null ||
              timesheetRequest.classId == -1) ||
          (timesheetRequest.timeId == null || timesheetRequest.timeId == -1) ||
          (timesheetRequest.date == null)) {
        return false;
      }
    } else if (_currentStep == 1) {
      if (timesheetRequest.imageBase64 == null ||
          timesheetRequest.imageBase64!.isEmpty) {
        return false;
      }
    }

    return true;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildProgressIndicator(),
            SizedBox(height: 20),
            Expanded(
              child: SingleChildScrollView(
                child: Column(children: [_buildStepContent()]),
              ),
            ),
            // Các nút Next và Back
            _buildBottomStep(),
          ],
        ),
      ),
    );
  }
}
