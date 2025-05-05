import 'package:animated_custom_dropdown/custom_dropdown.dart';
import 'package:flutter/material.dart';

class MultiSelectSearchDropdown<T extends CustomDropdownListFilter>
    extends StatelessWidget {
  final List<T> items;
  final String hintText;
  final void Function(List<T>) onListChanged;

  const MultiSelectSearchDropdown({
    Key? key,
    required this.items,
    required this.hintText,
    required this.onListChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomDropdown<T>.multiSelectSearch(
      itemsScrollController: ScrollController(),
      hintText: hintText,
      items: items,
      onListChanged: onListChanged,
    );
  }
}
