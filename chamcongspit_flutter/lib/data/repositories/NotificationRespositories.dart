import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/notification/NotificationResponse.dart';
import 'package:chamcongspit_flutter/data/services/NotificationServices.dart';

class NotificationRespositories {
  NotificationServices notificationServices = NotificationServices();
  Future<IndexResponse<NotificationResponse>> getNotification() async {
    return await notificationServices.getNotification();
  }

  Future<bool> readNotification(int id) async {
    return await notificationServices.readNotification(id);
  }
}
