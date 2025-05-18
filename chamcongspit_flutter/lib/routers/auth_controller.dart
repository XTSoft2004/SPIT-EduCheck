import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/models/notification/NotificationResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/AuthRespositories.dart';
import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
import 'package:chamcongspit_flutter/widgets/network_status_component.dart';
import 'package:chamcongspit_flutter/widgets/slide_alert.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final UserRespositories userRespositories = UserRespositories();
  AuthRespositories authRespositories = AuthRespositories();
  List<NotificationResponse>? notificationsResponse;

  SecureStorageService storage = SecureStorageService();

  Future<void> checkLoginStatus() async {
    bool isConnected = await NetworkStatusComponent.checkServerConnection();
    if (isConnected) {
      final currentRoute = Get.currentRoute;
      if (currentRoute == '/login' || currentRoute == '/register') {
        return;
      }

      // Kiểm tra token hiện tại có tồn tại ở server hay không
      // String tokenFCM = await storage.getValue('firebaseToken') ?? '';
      // if (tokenFCM.isNotEmpty) {
      //   List<FCMTokenMeResponse> fcmTokenMe =
      //       await userRespositories.getFCMMeToken();
      //   if (fcmTokenMe.isNotEmpty && !fcmTokenMe.contains(tokenFCM)) {
      //     SlideAlert.show(
      //       Get.context!,
      //       message: 'Thông tin bị thay đổi, vui lòng đăng nhập lại',
      //       type: SlideAlertType.error,
      //     );
      //     Get.offAllNamed('/login');
      //     await Future.delayed(Duration(seconds: 3));
      //     await FirebaseMessaging.instance.deleteToken();
      //     await storage.deleteValue('firebaseToken');
      //     return;
      //   }
      // }

      // Kiểm tra token còn hoạt đông hay không
      final response = await userRespositories.profile();
      if (response.expiryDate != null) {
        final DateTime expiryDate = DateTime.parse(response.expiryDate!);
        final DateTime dateNow = DateTime.now();
        if (expiryDate.isAfter(dateNow)) {
          return;
        }
        final value = await authRespositories.refreshToken();
        if (value.data == null ||
            value.data?.accessToken == null ||
            (value.data?.accessToken != null &&
                value.data!.accessToken!.isEmpty)) {
          SlideAlert.show(
            Get.context!,
            message: 'Đã hết phiên đăng nhập, vui lòng đăng nhập lại',
            type: SlideAlertType.error,
          );
          Get.offAllNamed('/login');
        } else {
          return;
        }
      }
      Get.offAllNamed('/login');
    }
  }
}
