import 'package:chamcongspit_flutter/data/models/user/UserMeResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/AuthRespositories.dart';
import 'package:chamcongspit_flutter/routers/app_router.dart';
import 'package:chamcongspit_flutter/widgets/slide_alert.dart';
import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  UserMeResponse? userMeResponse;
  AuthRespositories authRespositories = AuthRespositories();

  AppDrawer({super.key, required this.userMeResponse});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.blue, Colors.red],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Container(
              alignment: Alignment.center,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundImage:
                        Image.asset(
                          'assets/images/profile.png',
                          fit: BoxFit.cover,
                        ).image,
                  ),
                  SizedBox(height: 10),
                  Text(
                    userMeResponse?.studentName ?? 'Không xác định',
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                  // LoadingDotsText(
                  //   prefixText: 'Đang tải username',
                  //   isLoading:
                  //       userMeResponse?.studentName == null ||
                  //       (userMeResponse?.studentName?.isEmpty ?? true),
                  // ),
                ],
              ),
            ),
          ),
          ListTile(
            leading: Icon(Icons.home),
            title: Text('Trang chủ'),
            onTap: () {
              Navigator.pushNamedAndRemoveUntil(
                context,
                AppRoutes.home,
                (Route<dynamic> route) => false, // Remove all previous routes
              );
              // Add navigation logic here
            },
          ),
          ListTile(
            leading: Icon(Icons.list_rounded),
            title: Text('Danh sách chấm công'),
            onTap: () {
              Navigator.pushNamedAndRemoveUntil(
                context,
                AppRoutes.timesheet,
                (Route<dynamic> route) => false, // Remove all previous routes
              );
              // Add navigation logic here
            },
          ),
          ListTile(
            leading: Icon(Icons.settings),
            title: Text('Cài đặt'),
            onTap: () {
              Navigator.pop(context);
              // Add navigation logic here
            },
          ),
          ListTile(
            leading: Icon(Icons.logout),
            title: Text('Đăng xuất'),
            onTap: () async {
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/login',
                (Route<dynamic> route) => false, // Remove all previous routes
              );
              if (context.mounted) {
                SlideAlert.show(
                  context,
                  message: 'Đăng xuất thành công',
                  type: SlideAlertType.success,
                  duration: Duration(seconds: 2),
                );
              }
              authRespositories.logout(); // Call logout method from repository
            },
          ),
        ],
      ),
    );
  }
}
