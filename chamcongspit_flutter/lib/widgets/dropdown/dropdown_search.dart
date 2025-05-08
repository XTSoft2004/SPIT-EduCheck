import 'package:animated_custom_dropdown/custom_dropdown.dart';
import 'package:flutter/material.dart';

class SearchDropdown<T> extends StatelessWidget {
  final List<T> items;
  final String hintText;
  final String searchHintText;
  final void Function(T?) onChanged;
  final T? initialItem;

  const SearchDropdown({
    super.key,
    this.initialItem,
    required this.items,
    required this.hintText,
    required this.searchHintText,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return CustomDropdown<T>.search(
      initialItem: items.contains(initialItem) ? initialItem : null,
      hintText: hintText,
      items: items,
      excludeSelected: false,
      onChanged: onChanged,
    );
  }
}
