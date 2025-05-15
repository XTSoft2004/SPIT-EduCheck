import 'dart:async';
import 'package:flutter/material.dart';

class LoadingDotsText extends StatefulWidget {
  final String prefixText;
  final TextStyle? textStyle;
  final Duration interval;

  const LoadingDotsText({
    super.key,
    this.prefixText = 'Đang tải',
    this.textStyle,
    this.interval = const Duration(milliseconds: 500),
  });

  @override
  State<LoadingDotsText> createState() => _LoadingDotsTextState();
}

class _LoadingDotsTextState extends State<LoadingDotsText> {
  late Timer _timer;
  int _dotCount = 1;
  String _displayText = '';

  @override
  void initState() {
    super.initState();
    _displayText = '${widget.prefixText}.';
    _timer = Timer.periodic(widget.interval, (timer) {
      setState(() {
        _dotCount = (_dotCount % 3) + 1;
        _displayText = '${widget.prefixText}${'.' * _dotCount}';
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text(
      _displayText,
      style:
          widget.textStyle ??
          const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
    );
  }
}
