import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/class/ClassResponse.dart';
import 'package:chamcongspit_flutter/data/models/student/StudentResponse.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetRequest.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetResponse.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetView.dart';
import 'package:chamcongspit_flutter/data/repositories/ClassRespositories.dart';
import 'package:chamcongspit_flutter/data/repositories/StudentResponsitories.dart';
import 'package:chamcongspit_flutter/data/services/TimesheetServices.dart';

class TimesheetRespositories {
  TimesheetServices timesheetService = TimesheetServices();
  StudentResponsitories studentResponsitories = StudentResponsitories();
  ClassResponsitories classResponsitories = ClassResponsitories();

  Future<IndexResponse<TimesheetView>> getTimesheet({
    int currentPage = -1,
    int pageSize = -1,
  }) async {
    IndexResponse<TimesheetResponse> timesheets = await timesheetService
        .getTimesheet(currentPage: currentPage, pageSize: pageSize);

    IndexResponse<StudentResponse> students =
        await studentResponsitories.getStudent();

    IndexResponse<ClassResponse> classes = await classResponsitories.getClass();

    IndexResponse<TimesheetView> timesheetViews = IndexResponse<TimesheetView>(
      data: <TimesheetView>[],
      meta: timesheets.meta,
    );

    for (var timesheet in timesheets.data!) {
      TimesheetView timesheetView = TimesheetView(
        id: timesheet.id,
        studentsName:
            students.data!
                .where(
                  (student) =>
                      timesheet.studentsId?.contains(student.id!) ?? false,
                )
                .map(
                  (student) =>
                      student.lastName! +
                      ' ' +
                      student
                          .firstName!, // Assuming 'firstName' and 'lastName' are properties of StudentResponse
                ) // Assuming 'name' is a property of StudentResponse
                .toList(),
        className:
            classes.data!
                .firstWhere(
                  (classResponse) => classResponse.id == timesheet.classId,
                  orElse:
                      () =>
                          ClassResponse(), // Provide a default value if not found
                )
                .name, // Assuming 'name' is a property of ClassResponse
        date: timesheet.date,
        imageUrl: timesheet.imageBase64,
        status: timesheet.status,
        time:
            timesheet.timeId != null
                ? timesheet.timeId == 1
                    ? 'Sáng'
                    : timesheet.timeId == 2
                    ? 'Chiều'
                    : timesheet.timeId == 3
                    ? 'Tối'
                    : null
                : null,
        note: timesheet.note,
      );
      timesheetViews.data!.add(timesheetView);
    }

    return timesheetViews;
  }

  Future<BaseResponse> createTimesheet(
    TimesheetRequest timesheetRequest,
  ) async {
    return await timesheetService.createTimesheet(timesheetRequest);
  }
}
