import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/widgets/slide_alert.dart';
import 'package:flutter/material.dart';
import 'package:chamcongspit_flutter/data/models/notification/NotificationResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/NotificationRespositories.dart';
import 'package:skeleton_loader/skeleton_loader.dart';
import 'package:intl/intl.dart'; // Thêm thư viện intl để định dạng ngày giờ

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
    if (!mounted) return;
    setState(() {
      isLoading = true;
    });

    // Thêm độ trễ giả lập vài giây trước khi tải dữ liệu
    await Future.delayed(const Duration(seconds: 2));

    try {
      IndexResponse<NotificationResponse> result =
          await notificationRespositories.getNotification();

      if (mounted) {
        setState(() {
          notifications = result.data ?? [];
        });
      }
    } catch (e) {
      if (mounted) {
        // SlideAlert.show(
        //   context,
        //   message: 'Lỗi tải thông báo: $e',
        //   type: SlideAlertType.error,
        // );
      }
      debugPrint('Error loading notifications: $e');
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  Future<void> readNotification(int? id) async {
    if (id == null || id < 0) {
      debugPrint('ID thông báo không hợp lệ: $id');
      return;
    }

    try {
      var response = await notificationRespositories.readNotification(id);
      if (response == true) {
        setState(() {
          notifications.firstWhere((element) => element.id == id).isRead = true;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Lỗi đánh dấu đã đọc: $e')));
      }
      debugPrint('Error reading notification: $e');
    }
  }

  Future<void> readAllNotifications() async {
    try {
      // Lọc các thông báo chưa đọc và có ID hợp lệ
      var unreadNotifications =
          notifications.where((n) => n.isRead != true && n.id != null).toList();

      if (unreadNotifications.isEmpty) return;

      // Gọi API cho từng thông báo chưa đọc
      for (var notification in unreadNotifications) {
        await notificationRespositories.readNotification(notification.id!);
      }

      setState(() {
        for (var notification in notifications) {
          notification.isRead = true;
        }
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi đánh dấu tất cả đã đọc: $e')),
        );
      }
      debugPrint('Error reading all notifications: $e');
    }
  }

  // Hàm định dạng ngày giờ
  String formatDateTime(String? dateTime) {
    if (dateTime == null) return '';
    final date = DateTime.tryParse(dateTime);
    if (date == null) return '';
    return DateFormat('dd/MM/yyyy HH:mm:ss').format(date);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Thông báo'), centerTitle: true),
      body:
          isLoading
              ? SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: SkeletonLoader(
                  highlightColor: Colors.lightBlue[300]!,
                  period: const Duration(seconds: 2),
                  direction: SkeletonDirection.ltr,
                  builder: Container(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: List.generate(
                        15,
                        (index) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Row(
                            children: [
                              const CircleAvatar(radius: 24),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      height: 10,
                                      width: double.infinity,
                                      color: Colors.white,
                                    ),
                                    const SizedBox(height: 6),
                                    Container(
                                      height: 10,
                                      width: 150,
                                      color: Colors.white,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              )
              : Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 16, top: 12),
                    child: Align(
                      alignment: Alignment.centerRight,
                      child: ElevatedButton.icon(
                        onPressed:
                            notifications.any((n) => n.isRead != true) &&
                                    !isLoading
                                ? readAllNotifications
                                : null, // Vô hiệu hóa nếu không có thông báo chưa đọc
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
                      child:
                          notifications.isEmpty
                              ? const Center(
                                child: Text(
                                  'Không có thông báo nào',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey,
                                  ),
                                ),
                              )
                              : ListView.separated(
                                physics: const AlwaysScrollableScrollPhysics(),
                                padding: const EdgeInsets.all(16),
                                itemCount: notifications.length,
                                separatorBuilder:
                                    (_, __) => const SizedBox(height: 12),
                                itemBuilder: (context, index) {
                                  final notification = notifications[index];
                                  final isRead = notification.isRead == true;

                                  return Material(
                                    elevation: 3,
                                    borderRadius: BorderRadius.circular(16),
                                    color:
                                        isRead
                                            ? Colors.grey.shade100
                                            : Colors.white,
                                    child: InkWell(
                                      onTap:
                                          () =>
                                              readNotification(notification.id),
                                      borderRadius: BorderRadius.circular(16),
                                      child: Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Row(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            CircleAvatar(
                                              radius: 24,
                                              backgroundColor:
                                                  isRead
                                                      ? Colors.grey
                                                      : Colors.blue,
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
                                                      fontWeight:
                                                          FontWeight.bold,
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
                                                        MainAxisAlignment
                                                            .spaceBetween,
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
                                                              if (date !=
                                                                  null) {
                                                                return "${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year} "
                                                                    "${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')} ${date.second.toString().padLeft(2, '0')}";
                                                              }
                                                              return '';
                                                            })()
                                                            : '',
                                                        style: TextStyle(
                                                          fontSize: 12,
                                                          color:
                                                              Colors.grey[600],
                                                        ),
                                                      ),
                                                      if (!isRead)
                                                        TextButton.icon(
                                                          onPressed: () {
                                                            readNotification(
                                                              notification.id,
                                                            );
                                                          },
                                                          icon: const Icon(
                                                            Icons
                                                                .mark_email_read,
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
                                                            padding:
                                                                EdgeInsets.zero,
                                                            minimumSize:
                                                                const Size(
                                                                  0,
                                                                  0,
                                                                ),
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
