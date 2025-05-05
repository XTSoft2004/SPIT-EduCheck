class TimesheetView {
  int? id;
  List<String>? studentsName;
  String? className;
  String? date;
  String? time;
  String? imageUrl;
  String? status;
  String? note;

  TimesheetView({
    this.id,
    this.studentsName,
    this.className,
    this.date,
    this.time,
    this.imageUrl,
    this.status,
    this.note,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    if (studentsName != null) {
      data['studentsName'] = studentsName;
    }
    data['className'] = className;
    data['date'] = date;
    data['time'] = time;
    data['imageUrl'] = imageUrl;
    data['status'] = status;
    data['note'] = note;
    return data;
  }
}
