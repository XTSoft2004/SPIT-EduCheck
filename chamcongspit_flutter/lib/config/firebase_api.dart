import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:flutter_local_notifications/flutter_local_notifications.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

void initLocalNotification() {
  const AndroidInitializationSettings androidSettings =
      AndroidInitializationSettings('@mipmap/ic_launcher');

  const InitializationSettings initSettings = InitializationSettings(
    android: androidSettings,
  );

  flutterLocalNotificationsPlugin.initialize(initSettings);
}

void showLocalNotification(RemoteMessage message) {
  const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
    'channel_id',
    'channel_name',
    importance: Importance.max,
    priority: Priority.high,
  );

  const NotificationDetails platformDetails = NotificationDetails(
    android: androidDetails,
  );

  flutterLocalNotificationsPlugin.show(
    0,
    message.notification?.title ?? 'No Title',
    message.notification?.body ?? 'No Body',
    platformDetails,
  );
}

Future<void> handlerBackgroundMessage(RemoteMessage message) {
  print("Title message: ${message.notification?.title}");
  print("Body message: ${message.notification?.body}");
  print("Data message: ${message.data}");
  return Future.value();
}

class FirebaseAPI {
  final _firebaseMessaging = FirebaseMessaging.instance;
  SecureStorageService storage = SecureStorageService();
  Future<void> initNotification() async {
    await dotenv.load();
    await _firebaseMessaging.requestPermission();
    // String? token = await _firebaseMessaging.getToken(
    //   vapidKey:
    //       "BOW3SQQoyWcSTIHAaEpSsuP0DWLrdSSFZs9OiCBg2nlPHXvDYOP2X_wYS-LtsHN4rzjZoPTRSbcB8hwgtEHT2fY",
    // );

    FirebaseMessaging.onBackgroundMessage(handlerBackgroundMessage);

    // Init local notification
    initLocalNotification();

    // Foreground handler
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print("Foreground message: ${message.notification?.title}");
      showLocalNotification(message);
    });
  }
}
