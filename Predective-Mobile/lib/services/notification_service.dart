import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Notification IDs
const int _brakeNotificationId = 1;
const int _aiCheckNotificationId = 2;

// SharedPreferences key
const String _firstLaunchKey = 'futurista_notifications_scheduled';

// Global navigator key for routing from notification taps
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

// Tab indices for deep-link routing
const int tabBookMechanic = 3;
const int tabHealthReport = 1;
const int tabAlerts = 4;

/// Callback invoked when user taps a notification.
/// Switch to the relevant tab in MainNavigation.
void Function(int tab)? onNotificationTabSwitch;

class NotificationService {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  bool _initialized = false;

  /// Call once at app startup.
  Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;

    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const darwinSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const settings = InitializationSettings(
      android: androidSettings,
      iOS: darwinSettings,
    );

    await _plugin.initialize(
      settings,
      onDidReceiveNotificationResponse: _onTap,
    );
  }

  /// Handle notification tap — route to correct tab.
  void _onTap(NotificationResponse response) {
    final payload = response.payload;
    if (payload == 'book') {
      onNotificationTabSwitch?.call(tabBookMechanic);
    } else if (payload == 'health') {
      onNotificationTabSwitch?.call(tabHealthReport);
    } else if (payload == 'alerts') {
      onNotificationTabSwitch?.call(tabAlerts);
    }
  }

  /// Request permissions (Android 13+, iOS).
  Future<bool> requestPermission() async {
    // Android 13+
    final android = _plugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();
    if (android != null) {
      final granted = await android.requestNotificationsPermission();
      return granted ?? false;
    }

    // iOS
    final ios = _plugin.resolvePlatformSpecificImplementation<
        IOSFlutterLocalNotificationsPlugin>();
    if (ios != null) {
      final granted = await ios.requestPermissions(
        alert: true,
        badge: true,
        sound: true,
      );
      return granted ?? false;
    }

    return true;
  }

  /// Schedule the two first-launch demo notifications.
  /// Uses SharedPreferences to ensure this only ever runs once.
  Future<void> scheduleFirstLaunchNotificationsIfNeeded() async {
    final prefs = await SharedPreferences.getInstance();
    final alreadyScheduled = prefs.getBool(_firstLaunchKey) ?? false;
    if (alreadyScheduled) return;

    final granted = await requestPermission();
    if (!granted) return;

    await _scheduleDelayed(
      id: _brakeNotificationId,
      delaySeconds: 3,
      title: '⚠ Brake pads need attention',
      body: 'Your brake pads have 12 days left. Tap to book a check-up.',
      payload: 'book',
    );

    await _scheduleDelayed(
      id: _aiCheckNotificationId,
      delaySeconds: 8,
      title: 'AI check complete on your Innova',
      body: '1 critical issue found. Tap to see your health report.',
      payload: 'health',
    );

    await prefs.setBool(_firstLaunchKey, true);
  }

  /// Schedules a notification [delaySeconds] from now using Future.delayed.
  Future<void> _scheduleDelayed({
    required int id,
    required int delaySeconds,
    required String title,
    required String body,
    required String payload,
  }) async {
    Future.delayed(Duration(seconds: delaySeconds), () async {
      await _plugin.show(
        id,
        title,
        body,
        NotificationDetails(
          android: AndroidNotificationDetails(
            'futurista_channel',
            'Futurista Alerts',
            channelDescription: 'Car health alerts and AI updates',
            importance: Importance.high,
            priority: Priority.high,
            icon: '@mipmap/ic_launcher',
            styleInformation: BigTextStyleInformation(body),
          ),
          iOS: const DarwinNotificationDetails(
            presentAlert: true,
            presentBadge: true,
            presentSound: true,
          ),
        ),
        payload: payload,
      );
    });
  }
}
