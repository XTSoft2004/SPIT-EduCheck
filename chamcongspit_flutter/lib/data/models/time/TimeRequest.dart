class TimeRequest {
  int? id;
  String? name;

  TimeRequest({this.id, this.name});

  @override
  String toString() {
    return name!;
  }
}
