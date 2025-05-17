import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/models/fcmtoken/fcmTokenMeResponse.dart';
import 'package:chamcongspit_flutter/data/models/notification/NotificationResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/NotificationRespositories.dart';
import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
import 'package:chamcongspit_flutter/main.dart';
import 'package:chamcongspit_flutter/widgets/slide_alert.dart';
import 'package:firebase_messaging/firebase_messaging.dart'
    show FirebaseMessaging;
import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final UserRespositories userRespositories = UserRespositories();
  List<NotificationResponse>? notificationsResponse;

  SecureStorageService storage = SecureStorageService();

  Future<void> checkLoginStatus() async {
    //   bool isConnected = await NetworkStatusComponent.checkConnection();
    //   if (isConnected) {
    //     final currentRoute = Get.currentRoute;
    //     if (currentRoute == '/login' || currentRoute == '/register') {
    //       return;
    //     }

    //     // Kiểm tra xem người dùng đã đăng nhập hay chưa

    //     // Kiểm tra token hiện tại có tồn tại ở server hay không
    //     String tokenFCM = await storage.getValue('firebaseToken') ?? '';
    //     if (tokenFCM.isNotEmpty) {
    //       List<FCMTokenMeResponse> fcmTokenMe =
    //           await userRespositories.getFCMMeToken();
    //       if (fcmTokenMe.isNotEmpty && !fcmTokenMe.contains(tokenFCM)) {
    //         SlideAlert.show(
    //           Get.context!,
    //           message: 'Thông tin bị thay đổi, vui lòng đăng nhập lại',
    //           type: SlideAlertType.error,
    //         );
    //         Get.offAllNamed('/login');
    //         return;
    //       }
    //     }

    //     // Kiểm tra token còn hoạt đông hay không
    //     final response = await userRespositories.profile();
    //     if (response.expiryDate != null) {
    //       final DateTime expiryDate = DateTime.parse(response.expiryDate!);
    //       final DateTime dateNow = DateTime.now();
    //       if (expiryDate.isAfter(dateNow)) {
    //         return;
    //       }
    //     }
    //     Get.offAllNamed('/login');
    //   }
    // }

    final currentRoute = Get.currentRoute;
    if (currentRoute == '/login' || currentRoute == '/register') {
      return;
    }

    // Kiểm tra xem người dùng đã đăng nhập hay chưa

    // Kiểm tra token hiện tại có tồn tại ở server hay không
    String tokenFCM = await storage.getValue('firebaseToken') ?? '';
    if (tokenFCM.isNotEmpty) {
      List<FCMTokenMeResponse> fcmTokenMe =
          await userRespositories.getFCMMeToken();
      if (fcmTokenMe.isNotEmpty && !fcmTokenMe.contains(tokenFCM)) {
        SlideAlert.show(
          Get.context!,
          message: 'Thông tin bị thay đổi, vui lòng đăng nhập lại',
          type: SlideAlertType.error,
        );
        Get.offAllNamed('/login');
        return;
      }
    }

    // Kiểm tra token còn hoạt đông hay không
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
