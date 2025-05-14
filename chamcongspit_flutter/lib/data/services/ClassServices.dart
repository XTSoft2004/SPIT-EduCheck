import 'package:chamcongspit_flutter/config/app_config.dart';
import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/class/ClassResponse.dart';
import 'package:dio/dio.dart';

class ClassServices {
  final Dio dio = Dio();
  String baseUrl = AppConfig.baseUrl;
  final SecureStorageService storage = SecureStorageService();

  Future<IndexResponse<ClassResponse>> getClass({
    int currentPage = 0,
    int pageSize = 5,
  }) async {
    try {
      String? token = await storage.getValue('accessToken');
      final response = await dio.get(
        '$baseUrl/class?pageNumber=$currentPage&pageSize=$pageSize',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      var classes = IndexResponse<ClassResponse>.fromJson(
        response.data is Map<String, dynamic>
            ? response.data
            : Map<String, dynamic>.from(response.data),
        (json) => ClassResponse.fromJson(json as Map<String, dynamic>),
      );

      return classes;
    } catch (e) {
      return IndexResponse<ClassResponse>();
    }
  }
}
