import 'package:chamcongspit_flutter/presentation/screens/auth/login_screen.dart';
import 'package:chamcongspit_flutter/presentation/screens/calendar/calendar_screen.dart';
import 'package:chamcongspit_flutter/presentation/screens/dashboard/DashboardPage.dart';
import 'package:chamcongspit_flutter/presentation/screens/home/home_screen.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/Form/timesheet_form.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/timesheet_screen.dart';
import 'package:chamcongspit_flutter/presentation/widgets/app-loading.dart';
import 'package:chamcongspit_flutter/routers/app_binding.dart';
import 'package:get/get.dart';

class AppRoutes {
  static const loading = '/loading';
  static const login = '/login';
  static const home = '/home';
  static const timesheet = '/timesheet';
  static const calendar = '/calendar';
}

class AppPages {
  static final routes = [
    GetPage(
      name: AppRoutes.loading,
      page: () => const SplashScreen(),
      // binding: AppBinding(),
    ),
    GetPage(name: AppRoutes.login, page: () => const LoginScreen()),
    GetPage(
      name: AppRoutes.home,
      page: () => HomeScreen(screen: DashboardPage()),
      binding: AppBinding(),
    ),
    GetPage(
      name: AppRoutes.timesheet,
      page: () => HomeScreen(screen: TimesheetScreen()),
      binding: AppBinding(),
    ),
    GetPage(
      name: AppRoutes.calendar,
      page: () => HomeScreen(screen: CalendarScreen()),
      binding: AppBinding(),
    ),
  ];
}
