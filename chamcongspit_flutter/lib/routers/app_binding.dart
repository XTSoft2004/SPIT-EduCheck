import 'package:chamcongspit_flutter/routers/auth_controller.dart';
import 'package:get/get.dart';

class AppBinding extends Bindings {
  @override
  void dependencies() {
    final authController = Get.put(AuthController());
    authController.checkLoginStatus(); // Gọi một lần
  }
}
