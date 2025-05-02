import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  // Singleton pattern (nếu bạn muốn dùng 1 instance duy nhất)
  static final SecureStorageService _instance =
      SecureStorageService._internal();
  factory SecureStorageService() => _instance;

  SecureStorageService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  /// Lưu dữ liệu
  Future<void> setValue(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  /// Lấy dữ liệu
  Future<String?> getValue(String key) async {
    return await _storage.read(key: key);
  }

  /// Xóa dữ liệu theo key
  Future<void> deleteValue(String key) async {
    await _storage.delete(key: key);
  }

  /// Xóa tất cả dữ liệu
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
