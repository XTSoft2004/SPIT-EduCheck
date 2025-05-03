import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/semester/SemesterResponse.dart';
import 'package:chamcongspit_flutter/data/services/SemesterServices.dart';

class SemesterRepositories {
  SemesterServices semesterServices = SemesterServices();

  Future<IndexResponse<SemesterResponse>> AllSemester() async {
    IndexResponse<SemesterResponse> semester =
        await semesterServices.AllSemester();
    return semester;
  }
}
