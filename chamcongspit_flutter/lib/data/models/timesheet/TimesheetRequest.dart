class TimesheetRequest {
  int? id;
  List<int>? studentsId;
  int? classId;
  int? timeId;
  Date? date;
  String? imageBase64;
  String? status;
  String? note;

  TimesheetRequest({
    this.id,
    this.studentsId,
    this.classId,
    this.timeId,
    this.date,
    this.imageBase64,
    this.status,
    this.note,
  });

  TimesheetRequest.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    studentsId = json['studentsId'].cast<int>();
    classId = json['classId'];
    timeId = json['timeId'];
    date = json['date'] != null ? Date.fromString(json['date']) : null;
    imageBase64 = json['imageBase64'];
    status = json['status'];
    note = json['note'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['studentsId'] = studentsId;
    data['classId'] = classId;
    data['timeId'] = timeId;
    if (date != null) {
      data['date'] = date!.toString();
    }
    data['imageBase64'] = imageBase64;
    data['status'] = status;
    data['note'] = note;
    return data;
  }

  @override
  String toString() {
    return 'TimesheetRequest{id: $id, studentsId: $studentsId, classId: $classId, timeId: $timeId, date: $date, imageBase64: $imageBase64, status: $status, note: $note}';
  }
}

class Date {
  int? year;
  int? month;
  int? day;

  Date({this.day, this.month, this.year});

  factory Date.fromString(String dateString) {
    final parts = dateString.split('-');
    if (parts.length == 3) {
      return Date(
        day: int.tryParse(parts[0]),
        month: int.tryParse(parts[1]),
        year: int.tryParse(parts[2]),
      );
    }
    return Date();
  }

  @override
  String toString() {
    return '${year ?? ''}-${month?.toString().padLeft(2, '0')}-${day?.toString().padLeft(2, '0')}';
  }
}
