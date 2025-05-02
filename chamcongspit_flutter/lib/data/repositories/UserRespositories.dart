import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/user/UserMeResponse.dart';
import 'package:chamcongspit_flutter/data/models/user/UserProfileResponse.dart';
import 'package:chamcongspit_flutter/data/services/UserServices.dart';

class UserRespositories {
  late UserServices userServices = UserServices();
  final SecureStorageService storage = SecureStorageService();

  Future<UserMeResponse> Me() async {
    UserMeResponse userResponse = await userServices.Me();
    return userResponse;
  }

  Future<UserProfileResponse> Profile() async {
    UserProfileResponse userResponse = await userServices.Profile();
    if (userResponse.id != null) {
      storage.setValue('idUser', userResponse.id.toString());
      storage.setValue('roleName', userResponse.roleName.toString());
      storage.setValue('semesterId', userResponse.semesterId.toString());
    }
    return userResponse;
  }
}
