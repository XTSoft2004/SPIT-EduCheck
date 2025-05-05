import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/models/auth/RefreshTokenResponse.dart';
import 'package:dio/dio.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/auth/Login/LoginRequest.dart';
import 'package:chamcongspit_flutter/data/models/auth/Login/LoginResponse.dart';
import 'package:chamcongspit_flutter/config/app_config.dart';

class AuthServices {
  final Dio dio = Dio();
  String baseUrl = AppConfig.baseUrl;
  final SecureStorageService storage = SecureStorageService();

  Future<ShowResponse<LoginResponse>> LoginAccount(
    LoginRequest loginRequest,
  ) async {
    final response = await dio.post(
      '$baseUrl/auth/login',
      data: loginRequest.toJson(),
      options: Options(
        validateStatus: (status) {
          return true; // Cho phép tất cả status codes, kể cả lỗi
        },
      ),
    );

    var login = ShowResponse<LoginResponse>.fromJson(
      response.data,
      (json) => LoginResponse.fromJson(json as Map<String, dynamic>),
    );

    return login;
  }

  Future<bool> logout() async {
    try {
      final response = await dio.post(
        '$baseUrl/auth/logout',
        options: Options(
          validateStatus: (status) {
            return true; // Cho phép tất cả status codes, kể cả lỗi
          },
        ),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<ShowResponse<RefreshTokenResponse>> refreshToken() async {
    String? token = await storage.getValue('accessToken');

    final response = await dio.get(
      '$baseUrl/auth/refresh-token',
      options: Options(
        headers: {'Authorization': 'Bearer $token'},
        validateStatus: (_) => true,
      ),
    );

    var refreshToken = ShowResponse<RefreshTokenResponse>.fromJson(
      response.data is Map<String, dynamic>
          ? response.data
          : Map<String, dynamic>.from(response.data),
      (json) => RefreshTokenResponse.fromJson(json as Map<String, dynamic>),
    );

    return refreshToken;
  }
}
