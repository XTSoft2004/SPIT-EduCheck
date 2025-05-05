import 'package:chamcongspit_flutter/presentation/screens/auth/login_screen.dart';
import 'package:chamcongspit_flutter/presentation/screens/calendar/calendar_screen.dart';
import 'package:chamcongspit_flutter/presentation/screens/home/home_screen.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/timesheet_screen.dart';
import 'package:chamcongspit_flutter/routers/app_binding.dart';
import 'package:get/get.dart';

class AppRoutes {
  static const login = '/login';
  static const home = '/home';
  static const timesheet = '/timesheet';
}

class AppPages {
  static final routes = [
    GetPage(name: AppRoutes.login, page: () => const LoginScreen()),
    GetPage(
      name: AppRoutes.home,
      page: () => HomeScreen(screen: CalendarScreen()),
      binding: AppBinding(),
    ),
    GetPage(
      name: AppRoutes.timesheet,
      page: () => HomeScreen(screen: TimesheetScreen()),
      binding: AppBinding(),
    ),
  ];
}
