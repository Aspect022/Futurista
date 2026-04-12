import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:futurista/screens/splash_screen.dart';
import 'package:futurista/screens/home_screen.dart';
import 'package:futurista/screens/health_report_screen.dart';
import 'package:futurista/screens/ask_my_car_screen.dart';
import 'package:futurista/screens/book_mechanic_screen.dart';
import 'package:futurista/screens/alerts_screen.dart';
import 'package:futurista/theme/app_theme.dart';

// Mock all plugins that require native platform channels
void _setupPluginMocks() {
  TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
      .setMockMethodCallHandler(
    const MethodChannel('dexterous.com/flutter/local_notifications'),
    (MethodCall call) async => null,
  );
  TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
      .setMockMethodCallHandler(
    const MethodChannel('plugins.flutter.io/shared_preferences'),
    (MethodCall call) async {
      if (call.method == 'getAll') return <String, dynamic>{};
      return null;
    },
  );
}

/// Wraps a widget in the full Futurista theme for tests.
Widget _wrap(Widget child) {
  return MaterialApp(
    theme: AppTheme.lightTheme,
    home: child,
  );
}

void main() {
  setUp(_setupPluginMocks);

  testWidgets('Splash screen appears on launch', (WidgetTester tester) async {
    await tester.pumpWidget(_wrap(const SplashScreen()));
    await tester.pump(); // first frame

    expect(find.text('Futurista'), findsOneWidget);
    expect(find.text("Your car's AI mechanic"), findsOneWidget);
  });

  testWidgets('HomeScreen renders hero card and quick actions',
      (WidgetTester tester) async {
    await tester.pumpWidget(_wrap(const HomeScreen()));
    // Wait for 500ms skeleton delay
    await tester.pump(const Duration(milliseconds: 600));
    await tester.pumpAndSettle();

    // Car info visible after skeleton fades
    expect(find.text('Toyota Innova 2021'), findsOneWidget);
    expect(find.text('Full Report'), findsOneWidget);
    expect(find.text('Trip Check'), findsOneWidget);
    expect(find.text('Book Mechanic'), findsOneWidget);
  });

  testWidgets('HealthReportScreen renders component cards',
      (WidgetTester tester) async {
    await tester.pumpWidget(_wrap(const HealthReportScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Your Car\'s Health Report'), findsOneWidget);
    expect(find.text('Overall Health'), findsOneWidget);
  });

  testWidgets('AlertsScreen renders alert list', (WidgetTester tester) async {
    await tester.pumpWidget(_wrap(const AlertsScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Alerts'), findsOneWidget);
    expect(find.text('Mark all read'), findsOneWidget);
  });

  testWidgets('AskMyCarScreen renders chat header', (WidgetTester tester) async {
    await tester.pumpWidget(_wrap(const AskMyCarScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Ask My Car'), findsOneWidget);
    expect(find.text('Powered by Llama 3 AI'), findsOneWidget);
  });

  testWidgets('BookMechanicScreen renders booking form',
      (WidgetTester tester) async {
    await tester.pumpWidget(_wrap(const BookMechanicScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Book a Mechanic'), findsWidgets);
  });
}
