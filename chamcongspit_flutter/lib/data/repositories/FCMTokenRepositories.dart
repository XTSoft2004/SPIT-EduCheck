import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/models/fcmtoken/fcmTokenRequest.dart';
import 'package:chamcongspit_flutter/data/services/FCMTokenServices.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class FcmTokenRepositories {
  FCMTokenServices fcmTokenServices = FCMTokenServices();
  SecureStorageService storage = SecureStorageService();
  final _firebaseMessaging = FirebaseMessaging.instance;

  Future<bool> addFCMToken() async {
    String? token = await _firebaseMessaging.getToken(
      vapidKey:
          "BOW3SQQoyWcSTIHAaEpSsuP0DWLrdSSFZs9OiCBg2nlPHXvDYOP2X_wYS-LtsHN4rzjZoPTRSbcB8hwgtEHT2fY",
    );
    storage.setValue('firebaseToken', token!);
    print("Firebase Token: $token");
    fcmTokenRequest fcmTokenData = fcmTokenRequest(accessToken: token);

    bool result = await fcmTokenServices.addFCMToken(fcmTokenData);
    return result;
  }

  Future<bool> removeFCMToken() async {
    String? token = await storage.getValue('firebaseToken');
    fcmTokenRequest fcmTokenData = fcmTokenRequest(accessToken: token);

    bool result = await fcmTokenServices.removeFCMToken(fcmTokenData);
    return result;
  }
}
