import 'package:chamcongspit_flutter/presentation/screens/auth/login_screen.dart';
import 'package:chamcongspit_flutter/presentation/screens/home/home_screen.dart';
import 'package:chamcongspit_flutter/routers/app_binding.dart';
import 'package:get/get.dart';

class AppRoutes {
  static const login = '/login';
  static const home = '/home';
}

class AppPages {
  static final routes = [
    GetPage(name: AppRoutes.login, page: () => const LoginScreen()),
    GetPage(
      name: AppRoutes.home,
      page: () => const HomeScreen(),
      binding: AppBinding(),
    ),
  ];
}
