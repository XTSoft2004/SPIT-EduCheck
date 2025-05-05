import 'package:flutter/material.dart';

class StepForm extends StatelessWidget {
  final String label;
  final IconData icon;
  final Widget child;

  const StepForm({
    super.key,
    required this.label,
    required this.icon,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Card(
        elevation: 6,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 40, color: Colors.indigo),
              const SizedBox(height: 20),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 20),
              child, // đây là widget bạn muốn render, ví dụ TextField, Dropdown, v.v.
            ],
          ),
        ),
      ),
    );
  }
}
