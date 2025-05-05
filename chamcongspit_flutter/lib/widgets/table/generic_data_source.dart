import 'package:chamcongspit_flutter/widgets/table/paginated_table.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_datagrid/datagrid.dart';

class GenericDataSource<T> extends DataGridSource {
  final List<T> data;
  final RowBuilder<T> rowBuilder;
  final OnEdit<T>? onEdit;
  final OnDelete<T>? onDelete;

  GenericDataSource({
    required this.data,
    required this.rowBuilder,
    this.onEdit,
    this.onDelete,
  }) {
    _buildDataGridRows();
  }

  late List<DataGridRow> _dataGridRows;

  void _buildDataGridRows() {
    _dataGridRows =
        data.map((item) {
          final cells = rowBuilder(item);

          if (onEdit != null || onDelete != null) {
            cells.add(
              DataGridCell<Widget>(
                columnName: 'action',
                value: Wrap(
                  spacing: 4.0,
                  children: [
                    if (onEdit != null)
                      IconButton(
                        icon: const Icon(Icons.edit, size: 20),
                        onPressed: () => onEdit!(item),
                      ),
                    if (onDelete != null)
                      IconButton(
                        icon: const Icon(Icons.delete, size: 20),
                        onPressed: () => onDelete!(item),
                      ),
                  ],
                ),
              ),
            );
          }

          return DataGridRow(cells: cells);
        }).toList();
  }

  @override
  List<DataGridRow> get rows => _dataGridRows;

  @override
  @override
  DataGridRowAdapter buildRow(DataGridRow row) {
    final index = _dataGridRows.indexOf(row);
    final isEven = index % 2 == 0;

    return DataGridRowAdapter(
      color: isEven ? Colors.grey[200] : Colors.white,
      cells:
          row.getCells().map((cell) {
            final value = cell.value;
            if (value is Widget) {
              return Container(
                padding: const EdgeInsets.all(8.0),
                alignment: Alignment.center,
                child: value,
              );
            } else {
              return Container(
                padding: const EdgeInsets.all(8.0),
                alignment: Alignment.center,
                child: Text(value.toString()),
              );
            }
          }).toList(),
    );
  }
}
