import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final UserRespositories userRespositories = UserRespositories();

  Future<void> checkLoginStatus() async {
    final response = await userRespositories.Profile();
    final currentRoute = Get.currentRoute;

    if (response.expiryDate == null ||
        (response.expiryDate != null &&
            DateTime.parse(response.expiryDate!).isBefore(DateTime.now()))) {
      if (currentRoute != '/login' && currentRoute != '/resetpass') {
        Get.offAllNamed('/login');
      }
    }
  }
}
