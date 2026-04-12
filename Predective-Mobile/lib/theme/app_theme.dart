import 'package:flutter/material.dart';

/// Futurista Design System — Clean Blue & White palette.
///
/// Philosophy: White-first, blue-accented. Maximum readability.
/// High contrast for quick at-a-glance car health decisions.
///
/// Core palette:
///   Primary   #1E40AF  (blue-800)  – trust, authority, interactive
///   Accent    #3B82F6  (blue-500)  – links, highlights, active states
///   Surface   #F0F6FF              – near-white with a hint of blue
///   Success   #16A34A  (green-600) – healthy components
///   Warning   #D97706  (amber-600) – medium risk
///   Critical  #DC2626  (red-600)   – danger, critical risk
class AppColors {
  AppColors._();

  // ─── Primary Blue ──────────────────────────────────────────────────
  /// Deep authority blue — buttons, active nav, rings
  static const Color primary = Color(0xFF1E40AF);

  /// Bright interactive blue — links, chip borders, highlights
  static const Color accent = Color(0xFF3B82F6);

  /// Very pale blue tint — use for tinted card headers / badge bg
  static const Color primaryLight = Color(0xFFDBEAFE); // blue-100

  /// Barely-blue surface — info chips, secondary bg areas
  static const Color primarySurface = Color(0xFFEFF6FF); // blue-50

  // ─── Secondary (Amber) ────────────────────────────────────────────
  static const Color secondary = Color(0xFFF59E0B);     // amber-500
  static const Color secondaryLight = Color(0xFFFEF3C7); // amber-100

  // ─── Semantic ─────────────────────────────────────────────────────
  static const Color success = Color(0xFF16A34A);       // green-600
  static const Color successLight = Color(0xFFDCFCE7);  // green-100

  static const Color warning = Color(0xFFD97706);       // amber-600
  static const Color warningLight = Color(0xFFFEF3C7);  // amber-100

  static const Color destructive = Color(0xFFDC2626);   // red-600
  static const Color destructiveLight = Color(0xFFFEE2E2); // red-100

  // ─── Light Mode Backgrounds ───────────────────────────────────────
  /// Near-white page canvas with a subtle cool tint — not stark white
  static const Color pageBackground = Color(0xFFF0F6FF);

  /// Pure white cards pop above the page background
  static const Color cardBackground = Color(0xFFFFFFFF);

  /// Very light cool grey — muted inputs, secondary surfaces
  static const Color muted = Color(0xFFF1F5F9); // slate-100

  /// Subtle cool-grey border — clearly visible without being heavy
  static const Color cardBorder = Color(0xFFBFD7FF); // custom light blue-grey

  // ─── Light Mode Text ──────────────────────────────────────────────
  /// Near-black, slightly blue-tinted — easier on white than pure black
  static const Color textPrimary = Color(0xFF0F172A);   // slate-900

  /// Medium grey — subtitles, captions, secondary info
  static const Color textSecondary = Color(0xFF64748B); // slate-500

  // ─── Dark Mode Backgrounds ────────────────────────────────────────
  /// Deep blue-slate — not pure black, reduces eye strain
  static const Color darkPageBackground = Color(0xFF0F172A); // slate-900

  /// Slightly lighter card layer above dark page
  static const Color darkCardBackground = Color(0xFF1E293B); // slate-800

  /// Muted dark — inputs, secondary surfaces
  static const Color darkMuted = Color(0xFF334155); // slate-700

  /// Visible dark border with blue undertone
  static const Color darkCardBorder = Color(0xFF334155); // slate-700

  // ─── Dark Mode Text ───────────────────────────────────────────────
  static const Color darkTextPrimary = Color(0xFFF1F5F9);   // slate-100
  static const Color darkTextSecondary = Color(0xFF94A3B8); // slate-400

  // ─── Navigation ───────────────────────────────────────────────────
  static const Color inactive = Color(0xFFCBD5E1);     // slate-300
  static const Color darkInactive = Color(0xFF475569); // slate-600
}

class AppSpacing {
  AppSpacing._();

  static const double cardHorizontalPadding = 16.0;
  static const double cardVerticalPadding = 12.0;
  /// 16px — matches rounded-2xl feel from web app
  static const double cardBorderRadius = 16.0;
  static const double pagePadding = 16.0;

  static const EdgeInsets cardPadding = EdgeInsets.symmetric(
    horizontal: cardHorizontalPadding,
    vertical: cardVerticalPadding,
  );

  static const EdgeInsets screenPadding = EdgeInsets.symmetric(
    horizontal: pagePadding,
  );
}

class AppTheme {
  AppTheme._();

  // ─── LIGHT THEME ─────────────────────────────────────────────────
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.pageBackground,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        onPrimary: Colors.white,
        secondary: AppColors.accent,
        onSecondary: Colors.white,
        surface: AppColors.cardBackground,
        onSurface: AppColors.textPrimary,
        error: AppColors.destructive,
        onError: Colors.white,
        surfaceContainerHighest: AppColors.muted,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.cardBackground,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.cardBackground,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.inactive,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
        unselectedLabelStyle: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w500,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.cardBackground,
        elevation: 0,
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
          side: const BorderSide(color: AppColors.cardBorder, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          minimumSize: const Size.fromHeight(48),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.2,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: AppColors.primary, width: 1.5),
          minimumSize: const Size.fromHeight(48),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.muted,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.cardBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.textSecondary),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.cardBorder,
        thickness: 0.5,
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 28, fontWeight: FontWeight.w800,
          color: AppColors.textPrimary, letterSpacing: -0.5,
        ),
        headlineMedium: TextStyle(
          fontSize: 22, fontWeight: FontWeight.w700,
          color: AppColors.textPrimary, letterSpacing: -0.3,
        ),
        headlineSmall: TextStyle(
          fontSize: 18, fontWeight: FontWeight.w700,
          color: AppColors.textPrimary, letterSpacing: -0.2,
        ),
        titleLarge: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
        titleMedium: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
        bodyLarge: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w400,
          color: AppColors.textPrimary, height: 1.5,
        ),
        bodyMedium: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w400,
          color: AppColors.textSecondary, height: 1.45,
        ),
        bodySmall: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w400,
          color: AppColors.textSecondary,
        ),
        labelLarge: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w600,
          color: AppColors.primary,
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.textPrimary,
        contentTextStyle: const TextStyle(color: Colors.white, fontSize: 13),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // ─── DARK THEME ──────────────────────────────────────────────────
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.darkPageBackground,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.accent,        // brighter blue works better on dark
        onPrimary: Colors.white,
        secondary: AppColors.secondary,
        onSecondary: Colors.white,
        surface: AppColors.darkCardBackground,
        onSurface: AppColors.darkTextPrimary,
        error: AppColors.destructive,
        onError: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.darkCardBackground,
        foregroundColor: AppColors.darkTextPrimary,
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: TextStyle(
          color: AppColors.darkTextPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.darkCardBackground,
        selectedItemColor: AppColors.accent,
        unselectedItemColor: AppColors.darkInactive,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
        unselectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkCardBackground,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
          side: const BorderSide(color: AppColors.darkCardBorder, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.accent,
          foregroundColor: Colors.white,
          elevation: 0,
          minimumSize: const Size.fromHeight(48),
          textStyle: const TextStyle(
            fontSize: 15, fontWeight: FontWeight.w700,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.accent,
          side: const BorderSide(color: AppColors.accent, width: 1.5),
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkMuted,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.accent, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.darkTextSecondary),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.darkCardBorder,
        thickness: 0.5,
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 28, fontWeight: FontWeight.w800,
          color: AppColors.darkTextPrimary, letterSpacing: -0.5,
        ),
        headlineMedium: TextStyle(
          fontSize: 22, fontWeight: FontWeight.w700,
          color: AppColors.darkTextPrimary, letterSpacing: -0.3,
        ),
        headlineSmall: TextStyle(
          fontSize: 18, fontWeight: FontWeight.w700,
          color: AppColors.darkTextPrimary,
        ),
        titleLarge: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w700,
          color: AppColors.darkTextPrimary,
        ),
        titleMedium: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w600,
          color: AppColors.darkTextPrimary,
        ),
        bodyLarge: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w400,
          color: AppColors.darkTextPrimary, height: 1.5,
        ),
        bodyMedium: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w400,
          color: AppColors.darkTextSecondary, height: 1.45,
        ),
        bodySmall: TextStyle(
          fontSize: 12, fontWeight: FontWeight.w400,
          color: AppColors.darkTextSecondary,
        ),
        labelLarge: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w600,
          color: AppColors.accent,
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.darkCardBackground,
        contentTextStyle: const TextStyle(
          color: AppColors.darkTextPrimary, fontSize: 13,
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
