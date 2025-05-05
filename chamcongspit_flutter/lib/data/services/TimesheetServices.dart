import 'package:chamcongspit_flutter/config/app_config.dart';
import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/semester/SemesterResponse.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetResponse.dart';
import 'package:dio/dio.dart';

class TimesheetServices {
  final Dio dio = Dio();
  String baseUrl = AppConfig.baseUrl;
  final SecureStorageService storage = SecureStorageService();

  Future<IndexResponse<TimesheetResponse>> getTimesheet({
    int currentPage = 0,
    int pageSize = 5,
  }) async {
    String? token = await storage.getValue('accessToken');
    final response = await dio.get(
      '$baseUrl/timesheet?pageNumber=$currentPage&pageSize=$pageSize',
      options: Options(
        headers: {'Authorization': 'Bearer $token'},
        validateStatus: (_) => true,
      ),
    );

    var timesheets = IndexResponse<TimesheetResponse>.fromJson(
      response.data is Map<String, dynamic>
          ? response.data
          : Map<String, dynamic>.from(response.data),
      (json) => TimesheetResponse.fromJson(json as Map<String, dynamic>),
    );

    return timesheets;
  }
}
