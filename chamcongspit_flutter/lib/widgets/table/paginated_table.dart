import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_datagrid/datagrid.dart';

import 'generic_data_source.dart';

typedef RowBuilder<T> = List<DataGridCell> Function(T data);
typedef OnEdit<T> = void Function(T data);
typedef OnDelete<T> = void Function(T data);

class PaginatedDataTableCustom<T> extends StatefulWidget {
  final List<T>? data;
  final List<GridColumn> columns;
  final RowBuilder<T> buildRow;
  final OnEdit<T>? onEdit;
  final OnDelete<T>? onDelete;
  final Meta? paginated;
  final int? currentPage;
  final int? pageSize;
  final void Function(int currentPage)? onCurrentPageChanged;
  final void Function(int pageSize)? onPageSizeChanged;

  const PaginatedDataTableCustom({
    super.key,
    required this.data,
    required this.columns,
    required this.buildRow,
    this.onEdit,
    this.onDelete,
    this.paginated,
    this.currentPage = 1,
    this.pageSize = 5,
    this.onCurrentPageChanged,
    this.onPageSizeChanged,
  });

  @override
  State<PaginatedDataTableCustom<T>> createState() =>
      _PaginatedDataTableState<T>();
}

class _PaginatedDataTableState<T> extends State<PaginatedDataTableCustom<T>> {
  late GenericDataSource<T> _dataSource;
  late int _currentPage;
  late int _pageSize;
  late int _totalPages;
  @override
  void initState() {
    super.initState();
    _currentPage = widget.currentPage ?? 0;
    _pageSize = widget.pageSize ?? 5;
    _totalPages = widget.paginated?.totalPages ?? 0;
    _updateDataSource();
  }

  void _updateDataSource() {
    _dataSource = GenericDataSource<T>(
      data: widget.data ?? [],
      rowBuilder: widget.buildRow,
      onEdit: widget.onEdit,
      onDelete: widget.onDelete,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: SfDataGrid(
            source: _dataSource,
            columns: widget.columns,
            rowHeight: 80,
          ),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            DropdownButton<int>(
              value: _pageSize,
              items:
                  [5, 10, 20]
                      .map(
                        (e) => DropdownMenuItem(
                          value: e,
                          child: Text("Hiển thị $e"),
                        ),
                      )
                      .toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() {
                    _pageSize = val;
                    _currentPage = 1;
                    _updateDataSource();
                  });
                  widget.onPageSizeChanged?.call(val);
                  widget.onCurrentPageChanged?.call(1);
                }
              },
            ),
            IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed:
                  _currentPage > 1
                      ? () {
                        setState(() {
                          _currentPage--;
                          _updateDataSource();
                        });
                        widget.onCurrentPageChanged?.call(_currentPage);
                      }
                      : null,
            ),
            Text('Trang $_currentPage / $_totalPages'),
            IconButton(
              icon: const Icon(Icons.arrow_forward),
              onPressed:
                  _currentPage < _totalPages - 1
                      ? () {
                        setState(() {
                          _currentPage++;
                          _updateDataSource();
                        });
                        widget.onCurrentPageChanged?.call(_currentPage);
                      }
                      : null,
            ),
          ],
        ),
      ],
    );
  }
}
