import 'package:chamcongspit_flutter/routers/app_router.dart';
// import 'package:chamcongspit_flutter/routers/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

void main() {
  // Get.put(AuthController());
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/home',
      getPages: AppPages.routes,
    );
  }
}
