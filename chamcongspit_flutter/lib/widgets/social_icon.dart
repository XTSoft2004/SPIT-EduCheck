// lib/widgets/social_icon.dart
import 'package:flutter/material.dart';

class SocialIcon extends StatelessWidget {
  final String assetPath;
  final VoidCallback onTap;

  const SocialIcon({Key? key, required this.assetPath, required this.onTap})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Image.asset(assetPath, height: 30),
      ),
    );
  }
}
