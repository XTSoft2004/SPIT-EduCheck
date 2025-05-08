import 'package:animated_custom_dropdown/custom_dropdown.dart';
import 'package:flutter/material.dart';

class MultiSelectSearchDropdown<T> extends StatelessWidget {
  final List<T> items;
  final String hintText;
  final String searchHintText;
  final void Function(List<T>) onListChanged;
  final List<T> initialItems;

  MultiSelectSearchDropdown({
    super.key,
    this.initialItems = const [],
    required this.items,
    required this.hintText,
    required this.searchHintText,
    required this.onListChanged,
  });

  @override
  Widget build(BuildContext context) {
    return CustomDropdown<T>.multiSelectSearch(
      initialItems: initialItems,
      itemsScrollController: ScrollController(),
      searchHintText: searchHintText,
      hintText: hintText,
      items: items,
      onListChanged: onListChanged,
    );
  }
}
