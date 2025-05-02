class UserProfileResponse {
  int? id;
  String? username;
  String? roleName;
  int? semesterId;
  String? expiryDate;

  UserProfileResponse({
    this.id,
    this.username,
    this.roleName,
    this.semesterId,
    this.expiryDate,
  });

  UserProfileResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    username = json['username'];
    roleName = json['roleName'];
    semesterId = json['semesterId'];
    expiryDate = json['expiryDate'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = this.id;
    data['username'] = this.username;
    data['roleName'] = this.roleName;
    data['semesterId'] = this.semesterId;
    data['expiryDate'] = this.expiryDate;
    return data;
  }
}
