class UserMeResponse {
  int? id;
  String? username;
  bool? isLocked;
  bool? isVerify;
  String? roleName;
  int? semesterId;
  String? studentName;

  UserMeResponse({
    this.id,
    this.username,
    this.isLocked,
    this.isVerify,
    this.roleName,
    this.semesterId,
    this.studentName,
  });

  UserMeResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    username = json['username'];
    isLocked = json['isLocked'];
    isVerify = json['isVerify'];
    roleName = json['roleName'];
    semesterId = json['semesterId'];
    studentName = json['studentName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = this.id;
    data['username'] = this.username;
    data['isLocked'] = this.isLocked;
    data['isVerify'] = this.isVerify;
    data['roleName'] = this.roleName;
    data['semesterId'] = this.semesterId;
    data['studentName'] = this.studentName;
    return data;
  }
}
