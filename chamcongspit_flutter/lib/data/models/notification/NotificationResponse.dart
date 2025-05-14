import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetRequest.dart';

class NotificationResponse {
  int? id;
  String? title;
  String? body;
  bool? isRead;
  DateTime? dateTimeCreate;
  NotificationResponse({this.title, this.body});

  NotificationResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    title = json['title'];
    body = json['body'];
    isRead = json['isRead'];
    dateTimeCreate =
        json['dateTimeCreate'] != null
            ? DateTime.parse(json['dateTimeCreate'])
            : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['title'] = title;
    data['body'] = body;
    data['isRead'] = isRead;
    data['dateTimeCreate'] = dateTimeCreate?.toIso8601String();
    return data;
  }
}
