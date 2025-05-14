class fcmTokenRequest {
  String? accessToken;

  fcmTokenRequest({this.accessToken});

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['accessToken'] = accessToken;
    return data;
  }

  fcmTokenRequest.fromJson(Map<String, dynamic> json) {
    accessToken = json['accessToken'] as String?;
  }
}
