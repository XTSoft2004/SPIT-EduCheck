class SemesterResponse {
  int? id;
  int? semestersNumber;
  int? yearStart;
  int? yearEnd;

  SemesterResponse({
    this.id,
    this.semestersNumber,
    this.yearStart,
    this.yearEnd,
  });

  SemesterResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    semestersNumber = json['semesters_Number'];
    yearStart = json['yearStart'];
    yearEnd = json['yearEnd'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['semesters_Number'] = semestersNumber;
    data['yearStart'] = yearStart;
    data['yearEnd'] = yearEnd;
    return data;
  }
}
