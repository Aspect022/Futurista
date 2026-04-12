import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/app_theme.dart';
import 'screens/splash_screen.dart';
import 'screens/home_screen.dart';
import 'screens/health_report_screen.dart';
import 'screens/ask_my_car_screen.dart';
import 'screens/book_mechanic_screen.dart';
import 'screens/alerts_screen.dart';
import 'services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
    ),
  );

  await NotificationService.instance.initialize();

  runApp(const FuturistaApp());
}

// ─── APP ROOT ─────────────────────────────────────────────────────────

class FuturistaApp extends StatefulWidget {
  const FuturistaApp({super.key});

  @override
  State<FuturistaApp> createState() => _FuturistaAppState();
}

class _FuturistaAppState extends State<FuturistaApp> {
  bool _showSplash = true;

  @override
  void initState() {
    super.initState();
    // Show splash for 1.8s then transition
    Future.delayed(const Duration(milliseconds: 1800), () {
      if (mounted) setState(() => _showSplash = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Futurista',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system, // respects device setting
      navigatorKey: navigatorKey,
      home: AnimatedSwitcher(
        duration: const Duration(milliseconds: 500),
        switchInCurve: Curves.easeIn,
        switchOutCurve: Curves.easeOut,
        transitionBuilder: (child, animation) {
          return FadeTransition(opacity: animation, child: child);
        },
        child: _showSplash
            ? const SplashScreen(key: ValueKey('splash'))
            : const MainNavigation(key: ValueKey('main')),
      ),
    );
  }
}

// ─── MAIN NAVIGATION ─────────────────────────────────────────────────

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;
  final int _alertBadgeCount = 3;

  @override
  void initState() {
    super.initState();
    onNotificationTabSwitch = _switchTab;
    NotificationService.instance.scheduleFirstLaunchNotificationsIfNeeded();
  }

  @override
  void dispose() {
    onNotificationTabSwitch = null;
    super.dispose();
  }

  void _switchTab(int index) {
    HapticFeedback.lightImpact();
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final screens = <Widget>[
      HomeScreen(onTabSwitch: _switchTab),
      HealthReportScreen(onTabSwitch: _switchTab),
      const AskMyCarScreen(),
      const BookMechanicScreen(),
      const AlertsScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).bottomNavigationBarTheme.backgroundColor,
        border: const Border(
          top: BorderSide(color: AppColors.cardBorder, width: 0.5),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _switchTab,
        elevation: 0,
        backgroundColor: Colors.transparent,
        items: [
          const BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            activeIcon: Icon(Icons.home_rounded),
            label: 'My Car',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.favorite_outline_rounded),
            activeIcon: Icon(Icons.favorite_rounded),
            label: 'Health Report',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline_rounded),
            activeIcon: Icon(Icons.chat_bubble_rounded),
            label: 'Ask AI',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today_outlined),
            activeIcon: Icon(Icons.calendar_today_rounded),
            label: 'Book',
          ),
          BottomNavigationBarItem(
            icon: _BadgedBellIcon(count: _alertBadgeCount, active: false),
            activeIcon: _BadgedBellIcon(count: _alertBadgeCount, active: true),
            label: 'Alerts',
          ),
        ],
      ),
    );
  }
}

// ─── BADGED BELL ICON ─────────────────────────────────────────────────

class _BadgedBellIcon extends StatelessWidget {
  final int count;
  final bool active;

  const _BadgedBellIcon({required this.count, required this.active});

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Icon(
          active
              ? Icons.notifications_rounded
              : Icons.notifications_none_rounded,
        ),
        if (count > 0)
          Positioned(
            top: -5,
            right: -7,
            child: Container(
              width: 17,
              height: 17,
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  '$count',
                  style: const TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
