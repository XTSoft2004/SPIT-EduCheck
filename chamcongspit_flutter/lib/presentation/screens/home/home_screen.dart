import 'package:chamcongspit_flutter/data/models/user/UserMeResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/UserRespositories.dart';
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
    final response =
        await userRespositories.Me(); // Không cần ép kiểu nếu hàm trả đúng loại
    setState(() {
      userProfileResponse = response;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${userProfileResponse?.studentName ?? 'User'}'),
      ),
      body: const Center(child: Text('Welcome to the Home Screen!')),
    );
  }
}
