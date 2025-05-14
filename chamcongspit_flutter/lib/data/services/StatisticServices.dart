import 'package:chamcongspit_flutter/config/app_config.dart';
import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/semester/SemesterResponse.dart';
import 'package:chamcongspit_flutter/data/models/statistic/InfoStatisticResponse.dart';
import 'package:chamcongspit_flutter/data/models/statistic/SalaryInfoResponse.dart';
import 'package:dio/dio.dart';

class StatisticServices {
  final Dio dio = Dio();
  String baseUrl = AppConfig.baseUrl;
  final SecureStorageService storage = SecureStorageService();

  Future<SalaryInfoResponse> SalaryInfo() async {
    try {
      String? token = await storage.getValue('accessToken');
      final response = await dio.get(
        '$baseUrl/statistic-salary',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      var salaryInfo = SalaryInfoResponse.fromJson(
        response.data as Map<String, dynamic>,
      );

      return salaryInfo;
    } catch (e) {
      return SalaryInfoResponse();
    }
  }

  Future<IndexResponse<InfoStatisticResponse>> InfoStatistic() async {
    try {
      String? token = await storage.getValue('accessToken');
      final response = await dio.get(
        '$baseUrl/statistic-info',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      var infoStatistic = IndexResponse<InfoStatisticResponse>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => InfoStatisticResponse.fromJson(json as Map<String, dynamic>),
      );

      return infoStatistic;
    } catch (e) {
      return IndexResponse<InfoStatisticResponse>();
    }
  }
}
