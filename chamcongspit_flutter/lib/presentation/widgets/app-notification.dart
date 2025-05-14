import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:flutter/material.dart';
import 'package:chamcongspit_flutter/data/models/notification/NotificationResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/NotificationRespositories.dart';

class AppNotification extends StatefulWidget {
  const AppNotification({super.key});

  @override
  State<AppNotification> createState() => _AppNotificationState();
}

class _AppNotificationState extends State<AppNotification> {
  List<NotificationResponse> notifications = [];
  final NotificationRespositories notificationRespositories =
      NotificationRespositories();
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    fetchNotifications();
  }

  Future<void> fetchNotifications() async {
    setState(() {
      isLoading = true;
    });

    try {
      // Giả sử có hàm getNotifications() trong NotificationRespositories
      IndexResponse<NotificationResponse> result =
          await notificationRespositories.getNotification();

      setState(() {
        notifications = result.data ?? [];
      });
    } catch (e) {
      debugPrint('Error loading notifications: $e');
    }

    setState(() {
      isLoading = false;
    });
  }

  Future<void> readNotification(int id) async {
    var response = await notificationRespositories.readNotification(id);
    if (response == true) {
      setState(() {
        notifications.firstWhere((element) => element.id == id).isRead = true;
      });
    }
  }

  Future<void> readAllNotifications() async {
    for (var notification in notifications.where((n) => n.isRead != true)) {
      await notificationRespositories.readNotification(notification.id ?? -1);
    }
    setState(() {
      for (var notification in notifications) {
        notification.isRead = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Thông báo'), centerTitle: true),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : notifications.isEmpty
              ? const Center(
                child: Text(
                  'Không có thông báo',
                  style: TextStyle(color: Colors.grey),
                ),
              )
              : Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 16, top: 12),
                    child: Align(
                      alignment: Alignment.centerRight,
                      child: ElevatedButton.icon(
                        onPressed: readAllNotifications,
                        icon: const Icon(Icons.mark_email_read_outlined),
                        label: const Text('Đánh dấu tất cả là đã đọc'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue.shade50,
                          foregroundColor: Colors.blue,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: RefreshIndicator(
                      onRefresh: fetchNotifications,
                      child: ListView.separated(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.all(16),
                        itemCount: notifications.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final notification = notifications[index];
                          final isRead = notification.isRead == true;

                          return Material(
                            elevation: 3,
                            borderRadius: BorderRadius.circular(16),
                            color: isRead ? Colors.grey.shade100 : Colors.white,
                            child: InkWell(
                              onTap:
                                  () => readNotification(notification.id ?? -1),
                              borderRadius: BorderRadius.circular(16),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    CircleAvatar(
                                      radius: 24,
                                      backgroundColor:
                                          isRead ? Colors.grey : Colors.blue,
                                      child: const Icon(
                                        Icons.notifications,
                                        color: Colors.white,
                                        size: 24,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            notification.title ??
                                                'Không có tiêu đề',
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                              color:
                                                  isRead
                                                      ? Colors.black54
                                                      : Colors.black87,
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            notification.body ??
                                                'Không có nội dung',
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: Colors.grey[800],
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                notification.dateTimeCreate !=
                                                        null
                                                    ? (() {
                                                      final date =
                                                          DateTime.tryParse(
                                                            notification
                                                                .dateTimeCreate!
                                                                .toString(),
                                                          );
                                                      if (date != null) {
                                                        return "${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year} "
                                                            "${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')} ${date.second.toString().padLeft(2, '0')}";
                                                      }
                                                      return '';
                                                    })()
                                                    : '',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.grey[600],
                                                ),
                                              ),
                                              if (!isRead)
                                                TextButton.icon(
                                                  onPressed: () {
                                                    readNotification(
                                                      notification.id ?? -1,
                                                    );
                                                  },
                                                  icon: const Icon(
                                                    Icons.mark_email_read,
                                                    size: 18,
                                                  ),
                                                  label: const Text(
                                                    'Đọc',
                                                    style: TextStyle(
                                                      fontSize: 13,
                                                    ),
                                                  ),
                                                  style: TextButton.styleFrom(
                                                    foregroundColor:
                                                        Colors.blue,
                                                    padding: EdgeInsets.zero,
                                                    minimumSize: Size(0, 0),
                                                    tapTargetSize:
                                                        MaterialTapTargetSize
                                                            .shrinkWrap,
                                                  ),
                                                ),
                                              if (isRead)
                                                const Icon(
                                                  Icons.check_circle,
                                                  color: Colors.green,
                                                  size: 20,
                                                ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
    );
  }
}
