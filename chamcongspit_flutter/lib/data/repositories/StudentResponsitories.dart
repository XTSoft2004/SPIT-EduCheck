import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/student/StudentResponse.dart';
import 'package:chamcongspit_flutter/data/services/StudentServices.dart';

class StudentResponsitories {
  StudentServices studentService = StudentServices();

  Future<IndexResponse<StudentResponse>> getStudent({
    int currentPage = -1,
    int pageSize = -1,
  }) async {
    IndexResponse<StudentResponse> students = await studentService.getStudent(
      currentPage: currentPage,
      pageSize: pageSize,
    );
    return students;
  }
}
