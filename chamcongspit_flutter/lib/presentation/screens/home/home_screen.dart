import 'package:chamcongspit_flutter/data/models/user/UserMeResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
import 'package:chamcongspit_flutter/presentation/screens/calendar/calendar_screen.dart';
import 'package:chamcongspit_flutter/presentation/screens/eKyc/kyc_personal_details.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/Form/timesheet_form.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/timesheet_screen.dart';
import 'package:chamcongspit_flutter/presentation/widgets/app-drawer.dart';
import 'package:chamcongspit_flutter/presentation/widgets/app-header.dart';
import 'package:circle_nav_bar/circle_nav_bar.dart';
import 'package:curved_navigation_bar/curved_navigation_bar.dart';
import 'package:flutter/material.dart';

class HomeScreen<T extends Widget> extends StatefulWidget {
  final T screen;

  const HomeScreen({super.key, required this.screen});

  @override
  State<HomeScreen<T>> createState() => _HomeScreenState<T>();
}

class _HomeScreenState<T extends Widget> extends State<HomeScreen<T>> {
  final UserRespositories userRespositories = UserRespositories();
  UserMeResponse? userProfileResponse; // Dùng nullable

  @override
  void initState() {
    super.initState();
    loadUserProfile();
  }

  void loadUserProfile() async {
    final response = await userRespositories.me();
    setState(() {
      userProfileResponse = response;
    });
  }

  int _tabIndex = 1;
  int get tabIndex => _tabIndex;
  set tabIndex(int v) {
    _tabIndex = v;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final int notificationCount = 3; // giả lập số thông báo

    return Scaffold(
      appBar: AppBar(
        title: AppHeader(),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: Icon(Icons.notifications),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Bạn đã nhấn vào thông báo!')),
                  );
                },
              ),
              if (notificationCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: CircleAvatar(
                    radius: 10,
                    backgroundColor: Colors.red,
                    child: Text(
                      '$notificationCount',
                      style: TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      drawer: AppDrawer(userMeResponse: userProfileResponse),
      body: SafeArea(
        // child: Padding(
        //   padding: const EdgeInsets.only(bottom: 30),
        //   child: widget.screen,
        // ),
        child: widget.screen,
      ),
      bottomNavigationBar: CircleNavBar(
        activeIcons: const [
          Icon(Icons.home, color: Colors.deepPurple),
          Icon(Icons.add, color: Colors.deepPurple),
          Icon(Icons.calendar_month, color: Colors.deepPurple),
        ],
        inactiveIcons: const [
          Icon(Icons.home, color: Colors.deepPurple),
          Icon(Icons.add, color: Colors.deepPurple),
          Icon(Icons.calendar_month, color: Colors.deepPurple),
        ],
        color: Colors.white,
        height: 60,
        circleWidth: 60,
        activeIndex: _tabIndex,
        onTap: (index) {
          setState(() {
            _tabIndex = index;
          });
          if (index == 0) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => HomeScreen(screen: CalendarScreen()),
              ),
            );
          } else if (index == 1) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => HomeScreen(screen: TimesheetForm()),
              ),
            );
          } else if (index == 2) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => HomeScreen(screen: CalendarScreen()),
              ),
            );
          }
        },
        // padding: const EdgeInsets.only(left: 16, right: 16, bottom: 20),
        shadowColor: Colors.deepPurple,
        elevation: 10,
      ),
    );
  }
}
