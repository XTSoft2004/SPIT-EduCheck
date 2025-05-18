import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/repositories/FCMTokenRepositories.dart';
import 'package:chamcongspit_flutter/widgets/network_status_component.dart';
import 'package:flutter/material.dart';
import 'package:chamcongspit_flutter/data/repositories/AuthRespositories.dart';
import 'package:chamcongspit_flutter/widgets/input_custom_field.dart';
import 'package:chamcongspit_flutter/widgets/slide_alert.dart';
import 'package:chamcongspit_flutter/widgets/social_icon.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final AuthRespositories _authRespositories = AuthRespositories();
  final FcmTokenRepositories _fcmTokenRepositories = FcmTokenRepositories();
  SecureStorageService storage = SecureStorageService();

  String? _usernameError;
  String? _passwordError;

  Future<void> _handleLogin() async {
    // await FirebaseAPI().initNotification();
    bool isConnected = await NetworkStatusComponent.checkServerConnection();
    if (!isConnected) {
      SlideAlert.show(
        context,
        message: 'Vui lòng kiểm tra kết nối mạng, vui lòng thử lại!',
        type: SlideAlertType.error,
      );
      return;
    }

    final username = _usernameController.text.trim();
    final password = _passwordController.text.trim();

    setState(() {
      _usernameError =
          username.isEmpty ? 'Tài khoản không được để trống' : null;
      _passwordError = password.isEmpty ? 'Mật khẩu không được để trống' : null;
    });

    if (_usernameError == null && _passwordError == null) {
      var response = await _authRespositories.loginAccount(username, password);
      if (response.data != null && response.data?.accessToken != null) {
        if (!mounted) return;
        SlideAlert.show(
          context,
          message: response.message!,
          type: SlideAlertType.success,
        );

        Navigator.pushNamedAndRemoveUntil(
          context,
          '/home',
          (Route<dynamic> route) => false,
        );

        await _fcmTokenRepositories.addFCMToken();
      } else if (response.message != null) {
        if (!mounted) return;
        SlideAlert.show(
          context,
          message: response.message!,
          type: SlideAlertType.error,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        // const SizedBox(height: 60),
        Container(
          padding: const EdgeInsets.all(10),
          child: Image.asset('assets/icons/spit_icon.png', height: 100),
        ),

        const SizedBox(height: 20),

        // Username input
        InputCustomField(
          label: 'Tài khoản',
          icon: Icons.person,
          controller: _usernameController,
        ),

        _usernameError != null
            ? Padding(
              padding: const EdgeInsets.only(left: 20, top: 5, bottom: 5),
              child: Row(
                children: [
                  const Icon(Icons.error, color: Colors.red, size: 18),
                  const SizedBox(width: 5),
                  Text(
                    _usernameError!,
                    style: const TextStyle(color: Colors.red, fontSize: 14),
                  ),
                ],
              ),
            )
            : const SizedBox(height: 20),

        // Password input
        InputCustomField(
          label: 'Mật khẩu',
          icon: Icons.key,
          controller: _passwordController,
          isPassword: true,
        ),

        _passwordError != null
            ? Padding(
              padding: const EdgeInsets.only(left: 20, top: 5, bottom: 5),
              child: Row(
                children: [
                  const Icon(Icons.error, color: Colors.red, size: 18),
                  const SizedBox(width: 5),
                  Text(
                    _passwordError!,
                    style: const TextStyle(color: Colors.red, fontSize: 14),
                  ),
                ],
              ),
            )
            : const SizedBox(height: 10),

        const Align(
          alignment: Alignment.centerRight,
          child: Text('Quên mật khẩu?', style: TextStyle(color: Colors.grey)),
        ),

        const SizedBox(height: 10),

        // Login button
        GestureDetector(
          onTap: _handleLogin,
          child: Container(
            padding: const EdgeInsets.all(15),
            margin: const EdgeInsets.symmetric(horizontal: 50),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(50),
              color: Colors.blue,
            ),
            child: const Center(
              child: Text(
                'Đăng nhập',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),

        const SizedBox(height: 20),

        // Signup prompt
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Bạn chưa có tài khoản?',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(width: 5),
            GestureDetector(
              onTap: () {
                // TODO: chuyển đến trang đăng ký
              },
              child: const Text(
                'Đăng ký',
                style: TextStyle(
                  color: Colors.blue,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 10),
        const Center(child: Text('Hoặc', style: TextStyle(color: Colors.grey))),
        const SizedBox(height: 20),

        // Social icons
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SocialIcon(assetPath: 'assets/icons/google_icon.png', onTap: () {}),
            const SizedBox(width: 16),
            SocialIcon(
              assetPath: 'assets/icons/facebook_icon.png',
              onTap: () {},
            ),
          ],
        ),
      ],
    );
  }
}
