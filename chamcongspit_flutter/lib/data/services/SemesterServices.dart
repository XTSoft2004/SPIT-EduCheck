import 'package:chamcongspit_flutter/config/app_config.dart';
import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/semester/SemesterResponse.dart';
import 'package:dio/dio.dart';

class SemesterServices {
  final Dio dio = Dio();
  String baseUrl = AppConfig.baseUrl;
  final SecureStorageService storage = SecureStorageService();

  Future<IndexResponse<SemesterResponse>> AllSemester() async {
    try {
      String? token = await storage.getValue('accessToken');
      final response = await dio.get(
        '$baseUrl/semester',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      var semester = IndexResponse<SemesterResponse>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => SemesterResponse.fromJson(json as Map<String, dynamic>),
      );

      return semester;
    } catch (e) {
      return IndexResponse<SemesterResponse>();
    }
  }
}
