class TimesheetResponse {
  int? id;
  List<int>? studentsId;
  int? classId;
  int? timeId;
  String? date;
  String? imageBase64;
  String? status;
  String? note;

  TimesheetResponse({
    this.id,
    this.studentsId,
    this.classId,
    this.timeId,
    this.date,
    this.imageBase64,
    this.status,
    this.note,
  });

  TimesheetResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    studentsId = json['studentsId'].cast<int>();
    classId = json['classId'];
    timeId = json['timeId'];
    date = json['date'];
    imageBase64 = json['imageBase64'];
    status = json['status'];
    note = json['note'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['studentsId'] = studentsId;
    data['classId'] = classId;
    data['timeId'] = timeId;
    data['date'] = date;
    data['imageBase64'] = imageBase64;
    data['status'] = status;
    data['note'] = note;
    return data;
  }
}
