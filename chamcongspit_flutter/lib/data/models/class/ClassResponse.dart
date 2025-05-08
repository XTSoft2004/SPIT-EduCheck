class ClassResponse {
  int? id;
  String? code;
  String? name;
  int? day;
  String? timeStart;
  String? timeEnd;
  int? courseId;
  List<int>? studentsId;
  List<int>? lecturersId;

  ClassResponse({
    this.id,
    this.code,
    this.name,
    this.day,
    this.timeStart,
    this.timeEnd,
    this.courseId,
    this.studentsId,
    this.lecturersId,
  });

  ClassResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    code = json['code'];
    name = json['name'];
    day = json['day'];
    timeStart = json['timeStart'];
    timeEnd = json['timeEnd'];
    courseId = json['courseId'];
    studentsId = json['studentsId'].cast<int>();
    lecturersId = json['lecturersId'].cast<int>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['code'] = code;
    data['name'] = name;
    data['day'] = day;
    data['timeStart'] = timeStart;
    data['timeEnd'] = timeEnd;
    data['courseId'] = courseId;
    data['studentsId'] = studentsId;
    data['lecturersId'] = lecturersId;
    return data;
  }

  @override
  String toString() {
    return name!;
  }
}
