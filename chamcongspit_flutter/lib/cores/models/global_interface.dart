class Meta {
  final int? totalRecords;
  final int? totalPages;
  final int? currentPage;
  final int? pageSize;

  Meta({this.totalRecords, this.totalPages, this.currentPage, this.pageSize});

  factory Meta.fromJson(Map<String, dynamic> json) {
    return Meta(
      totalRecords: json['totalRecords'] as int?,
      totalPages: json['totalPages'] as int?,
      currentPage: json['currentPage'] as int?,
      pageSize: json['pageSize'] as int?,
    );
  }
}

class BaseResponse {
  final bool? ok;
  final int? status;
  final String? message;

  BaseResponse({this.ok, this.status, this.message});
}

class ShowResponse<T> extends BaseResponse {
  final T? data;

  ShowResponse({bool? ok, int? status, String? message, this.data})
    : super(ok: ok, status: status, message: message);

  factory ShowResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) {
    return ShowResponse(
      ok: json['ok'] as bool?,
      status: json['status'] as int?,
      message: json['message'] as String?,
      data: json['data'] != null ? fromJsonT(json['data']) : null,
    );
  }
}

class IndexResponse<T> extends BaseResponse {
  final List<T>? data;
  final Meta? meta;

  IndexResponse({bool? ok, int? status, String? message, this.data, this.meta})
    : super(ok: ok, status: status, message: message);

  factory IndexResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) {
    return IndexResponse(
      ok: json['ok'] as bool?,
      status: json['status'] as int?,
      message: json['message'] as String?,
      data: (json['data'] as List?)?.map(fromJsonT).toList(),
      meta: Meta(
        totalRecords: json['totalRecords'] as int?,
        totalPages: json['totalPages'] as int?,
        currentPage: json['currentPage'] as int?,
        pageSize: json['pageSize'] as int?,
      ),
    );
  }
}
