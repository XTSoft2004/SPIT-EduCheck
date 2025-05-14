import 'package:chamcongspit_flutter/config/app_config.dart';
import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/class/ClassResponse.dart';
import 'package:chamcongspit_flutter/data/models/fcmtoken/fcmTokenRequest.dart';
import 'package:dio/dio.dart';

class FCMTokenServices {
  final Dio dio = Dio();
  String baseUrl = AppConfig.baseUrl;
  final SecureStorageService storage = SecureStorageService();

  Future<bool> addFCMToken(fcmTokenRequest fcmToken) async {
    try {
      String? token = await storage.getValue('accessToken');
      final response = await dio.post(
        '$baseUrl/fcmtoken/register',
        data: fcmToken.toJson(),
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

  Future<bool> removeFCMToken(fcmTokenRequest fcmToken) async {
    try {
      String? token = await storage.getValue('accessToken');
      final response = await dio.post(
        '$baseUrl/fcmtoken/remove',
        data: fcmToken.toJson(),
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
