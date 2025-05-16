class InfoStatisticResponse {
  int? numberStudent;
  int? numberTimesheet;
  String? topTimesheetStudentName;
  int? numberTimesheetDay;

  InfoStatisticResponse({
    this.numberStudent,
    this.numberTimesheet,
    this.topTimesheetStudentName,
    this.numberTimesheetDay,
  });

  InfoStatisticResponse.fromJson(Map<String, dynamic> json) {
    numberStudent = json['numberStudent'];
    numberTimesheet = json['numberTimesheet'];
    topTimesheetStudentName = json['topTimesheetStudentName'];
    numberTimesheetDay = json['numberTimesheetDay'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['numberStudent'] = numberStudent;
    data['numberTimesheet'] = numberTimesheet;
    data['topTimesheetStudentName'] = topTimesheetStudentName;
    data['numberTimesheetDay'] = numberTimesheetDay;
    return data;
  }
}
