import 'package:chamcongspit_flutter/data/models/user/UserMeResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
import 'package:chamcongspit_flutter/presentation/widgets/app-drawer.dart';
import 'package:chamcongspit_flutter/presentation/widgets/app-header.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
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

  @override
  Widget build(BuildContext context) {
    final int notificationCount = 3; // giả lập số thông báo
    String selectedOption = 'Tùy chọn 1'; // mặc định dropdown

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
      body: const Center(child: Text('Welcome to the Home Screen!')),
    );
  }
}
