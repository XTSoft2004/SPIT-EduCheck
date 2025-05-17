import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/models/fcmtoken/fcmTokenMeResponse.dart';
import 'package:chamcongspit_flutter/data/models/user/UserMeResponse.dart';
import 'package:chamcongspit_flutter/data/models/user/UserProfileResponse.dart';
import 'package:dio/dio.dart';
import 'package:chamcongspit_flutter/config/app_config.dart';

class UserServices {
  final Dio dio = Dio();
  final SecureStorageService storage = SecureStorageService();
  String baseUrl = AppConfig.baseUrl;

  Future<UserMeResponse> me() async {
    String? token = await storage.getValue('accessToken');

    try {
      final response = await dio.get(
        '$baseUrl/user/me',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      return UserMeResponse.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      return UserMeResponse();
    }
  }

  Future<UserProfileResponse> profile() async {
    try {
      String? token = await storage.getValue('accessToken');
      final response = await dio.get(
        '$baseUrl/user/profile',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      return UserProfileResponse.fromJson(
        response.data as Map<String, dynamic>,
      );
    } catch (e) {
      return UserProfileResponse();
    }
  }

  Future<bool> setSemester(String semesterId) async {
    try {
      String? token = await storage.getValue('accessToken');
      final response = await dio.get(
        '$baseUrl/user/set-semester/$semesterId',
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

  Future<List<FCMTokenMeResponse>> getFCMMeToken() async {
    String? token = await storage.getValue('accessToken');
    try {
      final response = await dio.get(
        '$baseUrl/user/fcm-token-me',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          validateStatus: (_) => true,
        ),
      );

      return (response.data as List)
          .map((item) => FCMTokenMeResponse.fromJson(item))
          .toList();
    } catch (e) {
      return [];
    }
  }
}
