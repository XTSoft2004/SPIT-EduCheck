import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/models/auth/RefreshTokenResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/FCMTokenRepositories.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/auth/LoginRequest.dart';
import 'package:chamcongspit_flutter/data/models/auth/LoginResponse.dart';
import 'package:chamcongspit_flutter/data/services/AuthServices.dart';

class AuthRespositories {
  late AuthServices loginServices = AuthServices();
  final SecureStorageService storage = SecureStorageService();
  FcmTokenRepositories fcmTokenRepositories = FcmTokenRepositories();
  // Simulate a login API call
  Future<ShowResponse<LoginResponse>> loginAccount(
    String username,
    String password,
  ) async {
    var loginRequest = LoginRequest(username: username, password: password);
    ShowResponse<LoginResponse> loginResponse =
        await loginServices.LoginAccount(loginRequest);

    if (loginResponse.data?.accessToken != null) {
      storage.setValue('accessToken', loginResponse.data!.accessToken!);
    }
    if (loginResponse.data?.refreshToken != null) {
      storage.setValue('refreshToken', loginResponse.data!.refreshToken!);
    }
    if (loginResponse.data?.semesterId != null) {
      storage.setValue(
        'semesterId',
        loginResponse.data!.semesterId!.toString(),
      );
    }
    if (loginResponse.data?.roleName != null) {
      storage.setValue('roleName', loginResponse.data!.roleName!);
    }
    return loginResponse;
  }

  Future<void> logout() async {
    // Gọi API Đăng xuất
    await fcmTokenRepositories.removeFCMToken();
    await loginServices.logout();
    // Xóa token khỏi Secure Storage
    final storage = const FlutterSecureStorage();
    await storage.delete(key: 'accessToken');
    await storage.delete(key: 'refreshToken');
  }

  Future<ShowResponse<RefreshTokenResponse>> refreshToken() async {
    ShowResponse<RefreshTokenResponse> refreshTokenResponse =
        await loginServices.refreshToken();

    if (refreshTokenResponse.data?.accessToken != null) {
      storage.setValue('accessToken', refreshTokenResponse.data!.accessToken!);
    }
    if (refreshTokenResponse.data?.refreshToken != null) {
      storage.setValue(
        'refreshToken',
        refreshTokenResponse.data!.refreshToken!,
      );
    }
    if (refreshTokenResponse.data?.semesterId != null) {
      storage.setValue(
        'semesterId',
        refreshTokenResponse.data!.semesterId!.toString(),
      );
    }
    if (refreshTokenResponse.data?.roleName != null) {
      storage.setValue('roleName', refreshTokenResponse.data!.roleName!);
    }
    return refreshTokenResponse;
  }
}
