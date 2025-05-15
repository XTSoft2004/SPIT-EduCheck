import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class NetworkStatusComponent extends StatefulWidget {
  final Widget child;

  const NetworkStatusComponent({Key? key, required this.child})
    : super(key: key);

  @override
  _NetworkStatusComponentState createState() => _NetworkStatusComponentState();

  static Future<bool> checkConnection() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    return connectivityResult == ConnectivityResult.mobile ||
        connectivityResult == ConnectivityResult.wifi ||
        connectivityResult == ConnectivityResult.ethernet;
  }
}

class _NetworkStatusComponentState extends State<NetworkStatusComponent> {
  late StreamSubscription<List<ConnectivityResult>> _connectivitySubscription;
  bool _isConnected = true;

  @override
  void initState() {
    super.initState();
    _checkInitialConnection();
    _subscribeToConnectivityChanges();
  }

  // Kiểm tra trạng thái kết nối ban đầu
  Future<void> _checkInitialConnection() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    _updateConnectionStatus(connectivityResult);
  }

  // Lắng nghe thay đổi trạng thái kết nối
  void _subscribeToConnectivityChanges() {
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen((
      List<ConnectivityResult> results,
    ) {
      _updateConnectionStatus(results);
    });
  }

  // Cập nhật trạng thái kết nối và hiển thị thông báo
  void _updateConnectionStatus(List<ConnectivityResult> results) {
    bool wasConnected = _isConnected;
    bool isConnected = results.any(
      (result) =>
          result == ConnectivityResult.wifi ||
          result == ConnectivityResult.mobile ||
          result == ConnectivityResult.ethernet,
    );

    if (wasConnected != isConnected) {
      setState(() {
        _isConnected = isConnected;
      });

      // Hiển thị thông báo
      Fluttertoast.showToast(
        msg: isConnected ? 'Đã kết nối lại!' : 'Mất kết nối mạng!',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: isConnected ? Colors.green : Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Trả về widget con (UI chính của ứng dụng)
        widget.child,
        // Hiển thị banner nếu mất kết nối
        if (!_isConnected)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              color: Colors.red,
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: const Text(
                'Không có kết nối mạng. Vui lòng kiểm tra lại!',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white, fontSize: 14),
              ),
            ),
          ),
      ],
    );
  }
}
