import 'package:flutter/material.dart';

enum SlideAlertType { success, error, warning, info }

class SlideAlert {
  static Future<void> show(
    BuildContext context, {
    required String message,
    required SlideAlertType type,
    Duration duration = const Duration(seconds: 3),
  }) async {
    final overlay = Navigator.of(context, rootNavigator: true).overlay;
    if (overlay == null) {
      throw FlutterError(
        'No Overlay widget found. Make sure the context provided is below a MaterialApp or Navigator.',
      );
    }
    // await Future.delayed(const Duration(seconds: 2));

    late OverlayEntry overlayEntry;

    overlayEntry = OverlayEntry(
      builder:
          (_) => _SlideAlertWidget(
            message: message,
            type: type,
            duration: duration,
            onDismiss: () => overlayEntry.remove(),
          ),
    );

    overlay.insert(overlayEntry);
  }
}

class _SlideAlertWidget extends StatefulWidget {
  final String message;
  final SlideAlertType type;
  final Duration duration;
  final VoidCallback onDismiss;

  const _SlideAlertWidget({
    Key? key,
    required this.message,
    required this.type,
    required this.duration,
    required this.onDismiss,
  }) : super(key: key);

  @override
  State<_SlideAlertWidget> createState() => _SlideAlertWidgetState();
}

class _SlideAlertWidgetState extends State<_SlideAlertWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _offsetAnimation;

  Color _backgroundColor() {
    switch (widget.type) {
      case SlideAlertType.success:
        return Colors.green;
      case SlideAlertType.error:
        return Colors.red;
      case SlideAlertType.warning:
        return Colors.orange;
      case SlideAlertType.info:
        return Colors.blue;
    }
  }

  IconData _iconData() {
    switch (widget.type) {
      case SlideAlertType.success:
        return Icons.check_circle;
      case SlideAlertType.error:
        return Icons.error;
      case SlideAlertType.warning:
        return Icons.warning;
      case SlideAlertType.info:
        return Icons.info;
    }
  }

  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 300),
    );
    _offsetAnimation = Tween<Offset>(
      begin: Offset(0, -1),
      end: Offset(0, 0),
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

    _fadeAnimation = CurvedAnimation(parent: _controller, curve: Curves.easeIn);

    _controller.forward();

    Future.delayed(widget.duration, () async {
      await _controller.reverse();
      widget.onDismiss();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 16,
      left: 16,
      right: 16,
      child: FadeTransition(
        opacity: _fadeAnimation,
        child: SlideTransition(
          position: _offsetAnimation,
          child: GestureDetector(
            // <- Thêm GestureDetector tại đây
            onTap: () async {
              await _controller.reverse();
              widget.onDismiss();
            },
            child: Material(
              elevation: 8,
              borderRadius: BorderRadius.circular(8),
              color: _backgroundColor(),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Icon(_iconData(), color: Colors.white),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        widget.message,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
