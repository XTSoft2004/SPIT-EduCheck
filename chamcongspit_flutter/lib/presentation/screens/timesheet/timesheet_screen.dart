import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetView.dart';
import 'package:chamcongspit_flutter/data/repositories/TimesheetRespositories.dart';
import 'package:chamcongspit_flutter/widgets/table/paginated_table.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_datagrid/datagrid.dart';

class TimesheetScreen extends StatefulWidget {
  @override
  State<TimesheetScreen> createState() => _TimesheetScreenState();
}

class _TimesheetScreenState extends State<TimesheetScreen> {
  int currentPage = 1;
  int pageSize = 5;
  bool isLoading = true;

  final timesheetRepository = TimesheetRespositories();
  IndexResponse<TimesheetView> timesheetResponse = IndexResponse();

  @override
  void initState() {
    super.initState();
    _loadTimesheet();
  }

  Future<void> _loadTimesheet() async {
    setState(() {
      isLoading = true;
    });

    final response = await timesheetRepository.getTimesheet(
      currentPage: currentPage,
      pageSize: pageSize,
    );

    if (mounted) {
      setState(() {
        timesheetResponse = response;
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
          child: Center(
            child: Text(
              'Danh sách điểm danh',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
        ),
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : timesheetResponse.data == null ||
                  timesheetResponse.data!.isEmpty
              ? const Center(child: Text('Không có dữ liệu'))
              : Padding(
                padding: const EdgeInsets.all(0),
                child: PaginatedDataTableCustom<TimesheetView>(
                  paginated: timesheetResponse.meta!,
                  data: timesheetResponse.data!,
                  buildRow: (e) {
                    final index = timesheetResponse.data!.indexOf(e);
                    final stt = (currentPage - 1) * pageSize + index + 1;

                    return [
                      DataGridCell(
                        columnName: 'stt',
                        value: Center(child: Text(stt.toString())),
                      ),
                      DataGridCell(
                        columnName: 'Image',
                        value: Center(
                          child:
                              e.imageUrl != null
                                  ? Image.network(
                                    e.imageUrl!,
                                    width: 100, // Tăng kích thước ảnh
                                    height: 100, // Tăng kích thước ảnh
                                    fit: BoxFit.cover,
                                    loadingBuilder: (
                                      context,
                                      child,
                                      loadingProgress,
                                    ) {
                                      if (loadingProgress == null) {
                                        return child;
                                      }
                                      return const SizedBox(
                                        width: 100,
                                        height: 100,
                                        child: Center(
                                          child: CircularProgressIndicator(),
                                        ),
                                      );
                                    },
                                    errorBuilder: (context, error, stackTrace) {
                                      return const Text('Error loading image');
                                    },
                                  )
                                  : const Text('No Image'),
                        ),
                      ),
                      DataGridCell(
                        columnName: 'studentsName',
                        value: Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            e.studentsName != null
                                ? e.studentsName!.join(', ').trim()
                                : 'Không có sinh viên',
                          ),
                        ),
                      ),
                      DataGridCell(
                        columnName: 'className',
                        value: Center(child: Text(e.className ?? '')),
                      ),
                      DataGridCell(
                        columnName: 'date',
                        value: Center(child: Text(e.date ?? '')),
                      ),
                      DataGridCell(
                        columnName: 'time',
                        value: Center(child: Text(e.time ?? '')),
                      ),
                      DataGridCell(
                        columnName: 'status',
                        value: Center(child: Text(e.status ?? '')),
                      ),
                      DataGridCell(
                        columnName: 'note',
                        value: Center(child: Text(e.note ?? '')),
                      ),
                    ];
                  },
                  columns: [
                    GridColumn(
                      columnName: 'stt',
                      label: Center(child: Center(child: Text('STT'))),
                      width: 60,
                    ),
                    GridColumn(
                      columnName: 'Image',
                      label: Center(child: Center(child: Text('Hình ảnh'))),
                      width: 100,
                    ),
                    GridColumn(
                      columnName: 'studentsName',
                      label: Center(child: Center(child: Text('Tên học sinh'))),
                      width: 200,
                    ),
                    GridColumn(
                      columnName: 'className',
                      label: Center(child: Center(child: Text('Tên lớp'))),
                      width: 150,
                    ),
                    GridColumn(
                      columnName: 'date',
                      label: Center(child: Center(child: Text('Ngày'))),
                      width: 100,
                    ),
                    GridColumn(
                      columnName: 'time',
                      label: Center(child: Center(child: Text('Ca'))),
                      width: 100,
                    ),
                    GridColumn(
                      columnName: 'status',
                      label: Center(child: Center(child: Text('Trạng thái'))),
                      width: 100,
                    ),
                    GridColumn(
                      columnName: 'note',
                      label: Center(child: Center(child: Text('Ghi chú'))),
                      width: 200,
                    ),
                    GridColumn(
                      columnName: 'action',
                      label: Center(child: Center(child: Text('Hành động'))),
                      width: 120,
                    ),
                  ],
                  onEdit: (e) => print('Sửa: ${e.id}'),
                  onDelete: (e) => print('Xóa: ${e.id}'),
                  currentPage: currentPage,
                  pageSize: pageSize,
                  onCurrentPageChanged: (newPage) {
                    setState(() {
                      currentPage = newPage;
                    });
                    _loadTimesheet();
                  },
                  onPageSizeChanged: (newSize) {
                    setState(() {
                      pageSize = newSize;
                      currentPage = 1; // reset về trang đầu
                    });
                    _loadTimesheet();
                  },
                ),
              ),
    );
  }
}
