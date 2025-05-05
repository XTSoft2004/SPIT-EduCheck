import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/class/ClassResponse.dart';
import 'package:chamcongspit_flutter/data/models/student/StudentResponse.dart';
import 'package:chamcongspit_flutter/data/services/ClassServices.dart';
import 'package:chamcongspit_flutter/data/services/StudentServices.dart';

class ClassResponsitories {
  ClassServices classService = ClassServices();

  Future<IndexResponse<ClassResponse>> getClass({
    int currentPage = -1,
    int pageSize = -1,
  }) async {
    IndexResponse<ClassResponse> classes = await classService.getClass(
      currentPage: currentPage,
      pageSize: pageSize,
    );
    return classes;
  }
}
