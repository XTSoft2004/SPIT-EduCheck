import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/models/user/UserMeResponse.dart';
import 'package:chamcongspit_flutter/data/models/user/UserProfileResponse.dart';
import 'package:dio/dio.dart';
import 'package:chamcongspit_flutter/global.dart';

class UserServices {
  final Dio dio = Dio();
  final SecureStorageService storage = SecureStorageService();
  String BaseUrl = Global.BaseUrl;

  Future<UserMeResponse> Me() async {
    String? token = await storage.getValue('accessToken');

    final response = await dio.get(
      '$BaseUrl/user/me',
      options: Options(
        headers: {'Authorization': 'Bearer $token'},
        validateStatus: (_) => true,
      ),
    );

    var user = UserMeResponse.fromJson(response.data as Map<String, dynamic>);

    return user;
  }

  Future<UserProfileResponse> Profile() async {
    String? token = await storage.getValue('accessToken');
    final response = await dio.get(
      '$BaseUrl/user/profile',
      options: Options(
        headers: {'Authorization': 'Bearer $token'},
        validateStatus: (_) => true,
      ),
    );

    var user = UserProfileResponse.fromJson(
      response.data as Map<String, dynamic>,
    );

    return user;
  }
}
