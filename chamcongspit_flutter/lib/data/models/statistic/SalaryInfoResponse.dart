class SalaryInfoResponse {
  int? toltalSalary;
  List<SalaryInfoStudents>? salaryInfoStudents;

  SalaryInfoResponse({this.toltalSalary, this.salaryInfoStudents});

  SalaryInfoResponse.fromJson(Map<String, dynamic> json) {
    toltalSalary = json['toltalSalary'];
    if (json['salaryInfoStudents'] != null) {
      salaryInfoStudents = <SalaryInfoStudents>[];
      json['salaryInfoStudents'].forEach((v) {
        salaryInfoStudents!.add(SalaryInfoStudents.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['toltalSalary'] = toltalSalary;
    if (salaryInfoStudents != null) {
      data['salaryInfoStudents'] =
          salaryInfoStudents!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class SalaryInfoStudents {
  int? idName;
  String? codeName;
  String? studentName;
  int? day;
  int? salary;

  SalaryInfoStudents({this.codeName, this.studentName, this.day, this.salary});

  SalaryInfoStudents.fromJson(Map<String, dynamic> json) {
    idName = json['idName'];
    codeName = json['codeName'];
    studentName = json['studentName'];
    day = json['day'];
    salary = json['salary'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['idName'] = idName;
    data['codeName'] = codeName;
    data['studentName'] = studentName;
    data['day'] = day;
    data['salary'] = salary;
    return data;
  }
}
