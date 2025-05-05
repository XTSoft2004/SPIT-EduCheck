class RefreshTokenResponse {
  int? id;
  String? username;
  bool? isLocked;
  bool? isVerify;
  String? roleName;
  int? semesterId;
  String? accessToken;
  String? refreshToken;
  String? studentName;

  RefreshTokenResponse({
    this.id,
    this.username,
    this.isLocked,
    this.isVerify,
    this.roleName,
    this.semesterId,
    this.accessToken,
    this.refreshToken,
    this.studentName,
  });

  RefreshTokenResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    username = json['username'];
    isLocked = json['isLocked'];
    isVerify = json['isVerify'];
    roleName = json['roleName'];
    semesterId = json['semesterId'];
    accessToken = json['accessToken'];
    refreshToken = json['refreshToken'];
    studentName = json['studentName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['username'] = username;
    data['isLocked'] = isLocked;
    data['isVerify'] = isVerify;
    data['roleName'] = roleName;
    data['semesterId'] = semesterId;
    data['accessToken'] = accessToken;
    data['refreshToken'] = refreshToken;
    data['studentName'] = studentName;
    return data;
  }
}
