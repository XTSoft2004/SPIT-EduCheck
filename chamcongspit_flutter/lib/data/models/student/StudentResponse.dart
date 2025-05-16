class StudentResponse {
  int? id;
  String? maSinhVien;
  String? firstName;
  String? lastName;
  String? className;
  String? phoneNumber;
  String? email;
  bool? gender;
  String? dob;
  String? userName;
  String? urlAvatar;

  StudentResponse({
    this.id,
    this.maSinhVien,
    this.firstName,
    this.lastName,
    this.className,
    this.phoneNumber,
    this.email,
    this.gender,
    this.dob,
    this.userName,
    this.urlAvatar,
  });

  StudentResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    maSinhVien = json['maSinhVien'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    className = json['class'];
    phoneNumber = json['phoneNumber'];
    email = json['email'];
    gender = json['gender'];
    dob = json['dob'];
    userName = json['userName'];
    urlAvatar = json['urlAvatar'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['maSinhVien'] = maSinhVien;
    data['firstName'] = firstName;
    data['lastName'] = lastName;
    data['class'] = className;
    data['phoneNumber'] = phoneNumber;
    data['email'] = email;
    data['gender'] = gender;
    data['dob'] = dob;
    data['userName'] = userName;
    data['urlAvatar'] = urlAvatar;
    return data;
  }

  @override
  String toString() {
    return '${lastName ?? ''} ${firstName ?? ''} (${maSinhVien ?? 'N/A'})'; // Handle null values explicitly
  }
}
