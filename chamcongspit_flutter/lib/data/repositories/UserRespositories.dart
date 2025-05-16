import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/fcmtoken/fcmTokenMeResponse.dart';
import 'package:chamcongspit_flutter/data/models/user/UserMeResponse.dart';
import 'package:chamcongspit_flutter/data/models/user/UserProfileResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/AuthRespositories.dart';
import 'package:chamcongspit_flutter/data/services/UserServices.dart';

class UserRespositories {
  late UserServices userServices = UserServices();
  final SecureStorageService storage = SecureStorageService();
  AuthRespositories authRespositories = AuthRespositories();
  Future<UserMeResponse> me() async {
    UserMeResponse userResponse = await userServices.me();
    return userResponse;
  }

  Future<UserProfileResponse> profile() async {
    UserProfileResponse userResponse = await userServices.profile();
    if (userResponse.id != null) {
      storage.setValue('idUser', userResponse.id.toString());
      storage.setValue('roleName', userResponse.roleName.toString());
      storage.setValue('semesterId', userResponse.semesterId.toString());
    }
    return userResponse;
  }

  Future<bool> setSemester(String semesterId) async {
    bool result = await userServices.setSemester(semesterId);
    if (result) {
      await authRespositories.refreshToken();
    }
    return result;
  }

  Future<List<FCMTokenMeResponse>> getFCMMeToken() async {
    List<FCMTokenMeResponse> fcmTokenResponse =
        await userServices.getFCMMeToken();
    return fcmTokenResponse;
  }
}
