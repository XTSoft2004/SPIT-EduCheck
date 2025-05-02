import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/auth/Login/LoginRequest.dart';
import 'package:chamcongspit_flutter/data/models/auth/Login/LoginResponse.dart';
import 'package:chamcongspit_flutter/data/services/AuthServices.dart';

class AuthRespositories {
  late AuthServices loginServices = AuthServices();
  final SecureStorageService storage = SecureStorageService();

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

    return loginResponse;
  }
}
