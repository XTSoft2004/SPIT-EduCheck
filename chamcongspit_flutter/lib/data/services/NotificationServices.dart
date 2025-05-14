import 'package:chamcongspit_flutter/config/app_config.dart';
import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/notification/NotificationResponse.dart';
import 'package:dio/dio.dart';

class NotificationServices {
  final Dio dio = Dio();
  String baseUrl = AppConfig.baseUrl;
  final SecureStorageService storage = SecureStorageService();

  Future<IndexResponse<NotificationResponse>> getNotification() async {
    String? token = await storage.getValue('accessToken');
    try {
      final response = await dio.get(
        '$baseUrl/notification',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      var notifications = IndexResponse<NotificationResponse>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => NotificationResponse.fromJson(json as Map<String, dynamic>),
      );

      return notifications;
    } catch (e) {
      return IndexResponse<NotificationResponse>();
    }
  }

  Future<bool> readNotification(int id) async {
    try {
      String? token = await storage.getValue('accessToken');

      final response = await dio.get(
        '$baseUrl/notification/read?NotificationId=$id',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
