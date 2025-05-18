import 'package:chamcongspit_flutter/routers/app_router.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoController;
  late Animation<Offset> _logoDropAnimation;
  late Animation<double> _scaleAnimation;

  late AnimationController _finalController;
  late Animation<Offset> _logoSlideLeftAnimation;
  late Animation<double> _textFadeIn;
  late Animation<Offset> _textUpAnimation;

  @override
  void initState() {
    super.initState();

    // Controller cho logo rơi và scale
    _logoController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _logoDropAnimation = Tween<Offset>(
      begin: const Offset(0, -2),
      end: const Offset(0, 0),
    ).animate(CurvedAnimation(parent: _logoController, curve: Curves.easeOut));

    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween<double>(1.0), weight: 80),
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: 1.2), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: 1.2, end: 1.0), weight: 10),
    ]).animate(_logoController);

    // Controller cho logo trượt trái và text xuất hiện
    _finalController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _logoSlideLeftAnimation = Tween<Offset>(
      begin: const Offset(0, 0),
      end: const Offset(-1.0, 0),
    ).animate(
      CurvedAnimation(parent: _finalController, curve: Curves.easeInOut),
    );

    _textFadeIn = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _finalController, curve: Curves.easeIn));

    _textUpAnimation = Tween<Offset>(
      begin: const Offset(0, 1.5),
      end: const Offset(0, 0),
    ).animate(
      CurvedAnimation(parent: _finalController, curve: Curves.easeInOut),
    );

    startAnimation();
  }

  Future<void> startAnimation() async {
    await _logoController.forward(); // Logo rơi xuống + bounce
    await _finalController.forward(); // Logo trượt trái + text xuất hiện
    await Future.delayed(
      const Duration(seconds: 1),
    ); // Delay trước khi chuyển trang
    if (!mounted) return;
    Get.offAllNamed(AppRoutes.home);
  }

  @override
  void dispose() {
    _logoController.dispose();
    _finalController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: [Colors.white, Color(0xFFE0E0E0)]),
        ),
        child: Center(
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Logo animation
              SlideTransition(
                position: _logoSlideLeftAnimation,
                child: Transform.translate(
                  offset: _logoDropAnimation.value,
                  child: Transform.scale(
                    scale: _scaleAnimation.value,
                    child: Image.asset(
                      'assets/icons/spit_icon.png',
                      width: 100,
                      height: 100,
                    ),
                  ),
                ),
              ),
              // Text animation
              SlideTransition(
                position: _textUpAnimation,
                child: FadeTransition(
                  opacity: _textFadeIn,
                  child: const Padding(
                    padding: EdgeInsets.only(left: 120.0),
                    child: Text(
                      'SPIT HUSC',
                      style: TextStyle(
                        fontFamily: 'Montserrat',
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                        shadows: [
                          Shadow(
                            blurRadius: 10.0,
                            color: Colors.grey,
                            offset: Offset(2.0, 2.0),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
