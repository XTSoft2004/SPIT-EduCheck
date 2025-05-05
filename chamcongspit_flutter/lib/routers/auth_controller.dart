import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final UserRespositories userRespositories = UserRespositories();

  Future<void> checkLoginStatus() async {
    final currentRoute = Get.currentRoute;
    if (currentRoute == '/login' || currentRoute == '/register') {
      return;
    }
    final response = await userRespositories.profile();
    if (response.expiryDate != null) {
      final DateTime expiryDate = DateTime.parse(response.expiryDate!);
      final DateTime dateNow = DateTime.now();
      if (expiryDate.isAfter(dateNow)) {
        return;
      }
    }
    Get.offAllNamed('/login');
  }
}
