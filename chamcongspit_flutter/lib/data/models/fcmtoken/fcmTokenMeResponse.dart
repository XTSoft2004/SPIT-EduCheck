class FCMTokenMeResponse {
  String? AccessToken;

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['accessToken'] = AccessToken;
    return data;
  }

  FCMTokenMeResponse.fromJson(Map<String, dynamic> json) {
    AccessToken = json['accessToken'] as String?;
  }
}
