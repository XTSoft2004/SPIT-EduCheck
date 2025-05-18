import 'dart:async';
import 'package:chamcongspit_flutter/config/app_config.dart';
import 'package:chamcongspit_flutter/cores/common/SecureStorageService.dart';
import 'package:chamcongspit_flutter/data/repositories/NotificationRespositories.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class NetworkStatusComponent extends StatefulWidget {
  final Widget child;

  const NetworkStatusComponent({Key? key, required this.child})
    : super(key: key);

  @override
  _NetworkStatusComponentState createState() => _NetworkStatusComponentState();

  static Future<bool> checkServerConnection() async {
    String baseUrl = AppConfig.baseUrl;
    final Dio dio = Dio();
    dio.options = BaseOptions(
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 5),
    );
    String urlServer = baseUrl.endsWith('/') ? baseUrl : '$baseUrl/';
    try {
      final response = await dio.get(
        '${urlServer}server',
        options: Options(validateStatus: (status) => true),
      );
      return response.statusCode != null &&
          response.statusCode! >= 200 &&
          response.statusCode! < 400;
    } catch (_) {
      return false;
    } finally {
      dio.close();
    }
  }
}

class _NetworkStatusComponentState extends State<NetworkStatusComponent> {
  late StreamSubscription<List<ConnectivityResult>> _connectivitySubscription;
  bool _isNetworkConnected = true;
  bool _isServerConnected = true;
  String baseUrl = AppConfig.baseUrl;
  Timer? _serverCheckTimer;
  late Dio _dio;
  bool _isCheckingServer = false;
  final NotificationRespositories notificationRespositories =
      NotificationRespositories();
  SecureStorageService storage = SecureStorageService();

  @override
  void initState() {
    super.initState();
    _dio = Dio();
    _dio.options = BaseOptions(
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 5),
    );
    _checkInitialConnection();
    _subscribeToConnectivityChanges();
    _startServerConnectionCheck();
  }

  void _loadNotification() async {
    final response = await notificationRespositories.getNotification();
    final lenNoti = response.data!.where((w) => w.isRead == false).length;
    await storage.setValue('lenNotification', lenNoti.toString());
  }

  Future<void> _checkInitialConnection() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    _updateNetworkStatus(connectivityResult);
    if (_isNetworkConnected) {
      await _checkServerConnection();
    }
  }

  void _subscribeToConnectivityChanges() {
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen((
      List<ConnectivityResult> results,
    ) async {
      _updateNetworkStatus(results);
      if (_isNetworkConnected && !_isCheckingServer) {
        await _checkServerConnection();
      } else if (!_isNetworkConnected) {
        setState(() {
          _isServerConnected = false;
        });
      }
    });
  }

  void _updateNetworkStatus(List<ConnectivityResult> results) {
    bool wasNetworkConnected = _isNetworkConnected;
    bool isNetworkConnected = results.any(
      (result) =>
          result == ConnectivityResult.wifi ||
          result == ConnectivityResult.mobile ||
          result == ConnectivityResult.ethernet,
    );

    if (wasNetworkConnected != isNetworkConnected) {
      setState(() {
        _isNetworkConnected = isNetworkConnected;
      });

      Fluttertoast.showToast(
        msg: isNetworkConnected ? 'Đã kết nối mạng!' : 'Mất kết nối mạng!',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: isNetworkConnected ? Colors.green : Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  Future<void> _checkServerConnection() async {
    if (_isCheckingServer) return;
    _isCheckingServer = true;

    String urlServer = baseUrl.endsWith('/') ? baseUrl : '$baseUrl/';
    try {
      final response = await _dio.get(
        '${urlServer}server',
        options: Options(validateStatus: (status) => true),
      );
      bool wasServerConnected = _isServerConnected;
      bool isServerConnected =
          response.statusCode != null &&
          response.statusCode! >= 200 &&
          response.statusCode! < 400;

      if (wasServerConnected != isServerConnected) {
        setState(() {
          _isServerConnected = isServerConnected;
        });

        if (!_isServerConnected) {
          Fluttertoast.showToast(
            msg: 'Mất kết nối tới server!',
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.TOP,
            backgroundColor: Colors.red,
            textColor: Colors.white,
            fontSize: 16.0,
          );
          if (_isNetworkConnected) {
            await Future.delayed(const Duration(seconds: 2));
            await _checkServerConnection();
          }
        } else {
          _loadNotification();
          Fluttertoast.showToast(
            msg: 'Đã kết nối lại server!',
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.TOP,
            backgroundColor: Colors.green,
            textColor: Colors.white,
            fontSize: 16.0,
          );
        }
      }
    } on DioError {
      if (_isServerConnected) {
        setState(() {
          _isServerConnected = false;
        });
        Fluttertoast.showToast(
          msg: 'Mất kết nối tới server!',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0,
        );
        if (_isNetworkConnected) {
          await Future.delayed(const Duration(seconds: 2));
          await _checkServerConnection();
        }
      }
    } finally {
      _isCheckingServer = false;
    }
  }

  void _startServerConnectionCheck() {
    _serverCheckTimer = Timer.periodic(const Duration(seconds: 3), (
      timer,
    ) async {
      if (_isNetworkConnected && !_isCheckingServer) {
        await _checkServerConnection();
      }
    });
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    _serverCheckTimer?.cancel();
    _dio.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.ltr,
      child: Stack(
        children: [
          widget.child,
          if (!_isNetworkConnected)
            Positioned(
              bottom: 0,
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
          if (_isNetworkConnected && !_isServerConnected)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                color: Colors.orange,
                padding: const EdgeInsets.symmetric(vertical: 3.0),
                child: const Text(
                  'Không thể kết nối tới server. Vui lòng thử lại sau!',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white, fontSize: 14),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
