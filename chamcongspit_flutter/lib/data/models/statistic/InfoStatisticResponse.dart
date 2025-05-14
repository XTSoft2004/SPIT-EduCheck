class InfoStatisticResponse {
  int? numberStudent;
  int? numberTimesheet;
  String? topTimesheetStudentName;

  InfoStatisticResponse({
    this.numberStudent,
    this.numberTimesheet,
    this.topTimesheetStudentName,
  });

  InfoStatisticResponse.fromJson(Map<String, dynamic> json) {
    numberStudent = json['numberStudent'];
    numberTimesheet = json['numberTimesheet'];
    topTimesheetStudentName = json['topTimesheetStudentName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['numberStudent'] = numberStudent;
    data['numberTimesheet'] = numberTimesheet;
    data['topTimesheetStudentName'] = topTimesheetStudentName;
    return data;
  }
}
