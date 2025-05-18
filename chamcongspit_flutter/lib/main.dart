import 'package:chamcongspit_flutter/widgets/network_status_component.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:chamcongspit_flutter/config/firebase_api.dart';
import 'package:chamcongspit_flutter/routers/app_router.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await FirebaseAPI().initNotification();

  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return NetworkStatusComponent(
      child: GetMaterialApp(
        debugShowCheckedModeBanner: false,
        initialRoute: '/loading',
        getPages: AppPages.routes,
      ),
    );
  }
}
