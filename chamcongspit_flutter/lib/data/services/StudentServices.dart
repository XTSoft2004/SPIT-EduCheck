import 'package:chamcongspit_flutter/config/app_config.dart';
import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/student/StudentResponse.dart';
import 'package:dio/dio.dart';

class StudentServices {
  final Dio dio = Dio();
  String baseUrl = AppConfig.baseUrl;
  final SecureStorageService storage = SecureStorageService();

  Future<IndexResponse<StudentResponse>> getStudent({
    int currentPage = 0,
    int pageSize = 5,
  }) async {
    String? token = await storage.getValue('accessToken');

    try {
      final response = await dio.get(
        '$baseUrl/student?pageNumber=$currentPage&pageSize=$pageSize',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      var students = IndexResponse<StudentResponse>.fromJson(
        response.data is Map<String, dynamic>
            ? response.data
            : Map<String, dynamic>.from(response.data),
        (json) => StudentResponse.fromJson(json as Map<String, dynamic>),
      );

      return students;
    } catch (e) {
      return IndexResponse<StudentResponse>();
    }
  }
}
