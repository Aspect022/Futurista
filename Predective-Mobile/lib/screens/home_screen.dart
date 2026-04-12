import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/health_ring.dart';
import '../widgets/skeleton_loader.dart';
import '../utils/route_transitions.dart';
import 'trip_check_screen.dart';

class HomeScreen extends StatefulWidget {
  final void Function(int)? onTabSwitch;

  const HomeScreen({super.key, this.onTabSwitch});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  // ─── Loading State ──────────────────────────────────────────────────
  bool _isLoading = true;

  // ─── Demo Mode ──────────────────────────────────────────────────────
  bool _demoMode = false;
  int _demoScore = mockCar.healthScore; // 48
  int _tapCount = 0;

  @override
  void initState() {
    super.initState();
    // 500ms artificial load delay to show skeleton
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  // ─── Triple-tap Demo Mode ────────────────────────────────────────────
  void _onCarNameTap() {
    _tapCount++;
    if (_tapCount >= 3) {
      _tapCount = 0;
      _toggleDemoMode();
    }
  }

  void _toggleDemoMode() {
    if (_demoMode) {
      // Turn off demo mode
      setState(() {
        _demoMode = false;
        _demoScore = mockCar.healthScore;
      });
    } else {
      setState(() => _demoMode = true);
      _runDemoSequence();
    }
  }

  Future<void> _runDemoSequence() async {
    // 1: Healthy-ish
    if (mounted) setState(() => _demoScore = 78);
    await Future.delayed(const Duration(milliseconds: 1600));
    if (!mounted || !_demoMode) return;

    // 2: Current degraded state
    if (mounted) setState(() => _demoScore = 48);
    await Future.delayed(const Duration(milliseconds: 1600));
    if (!mounted || !_demoMode) return;

    // 3: Critical — alert pops
    if (mounted) {
      setState(() => _demoScore = 32);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.warning_rounded, color: Colors.white, size: 16),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'AI Alert: Brake failure risk now CRITICAL',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
          backgroundColor: AppColors.destructive,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────
  Color _healthColor(int score) {
    if (score >= 80) return AppColors.success;      // #22C55E green
    if (score >= 50) return AppColors.warning;      // #EAB308 amber
    return AppColors.destructive;                   // #FF5C5C red
  }

  String _formatMileage(int mileage) {
    final str = mileage.toString();
    final buffer = StringBuffer();
    for (var i = 0; i < str.length; i++) {
      if (i > 0 && (str.length - i) % 3 == 0) buffer.write(',');
      buffer.write(str[i]);
    }
    return buffer.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            if (_demoMode) _buildDemoBanner(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.only(bottom: 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildHeader(),
                    const Divider(height: 1, color: AppColors.cardBorder),
                    const SizedBox(height: 16),
                    // Hero card — skeleton or real
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 400),
                      child: _isLoading
                          ? const SkeletonHeroCard(key: ValueKey('skeleton-hero'))
                          : _buildHeroCard(key: const ValueKey('hero')),
                    ),
                    const SizedBox(height: 16),
                    // AI summary card — skeleton or real
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 400),
                      switchInCurve: Curves.easeIn,
                      child: _isLoading
                          ? const SkeletonAISummaryCard(
                              key: ValueKey('skeleton-ai'))
                          : _buildAISummaryCard(
                              key: const ValueKey('ai-summary')),
                    ),
                    const SizedBox(height: 16),
                    _buildQuickActions(),
                    const SizedBox(height: 24),
                    _buildRecentAlerts(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Demo Banner ─────────────────────────────────────────────────────
  Widget _buildDemoBanner() {
    return GestureDetector(
      onTap: _toggleDemoMode,
      child: Container(
        width: double.infinity,
        color: AppColors.darkPageBackground,
        padding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('🎬', style: TextStyle(fontSize: 13)),
            SizedBox(width: 6),
            Text(
              'Demo Mode — Showing predictive AI in action',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            SizedBox(width: 6),
            Text('✕',
                style: TextStyle(fontSize: 12, color: AppColors.darkTextSecondary)),
          ],
        ),
      ),
    );
  }

  // ─── 1. HEADER ──────────────────────────────────────────────────────
  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Good morning, Driver',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Here\'s how your car is doing',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
          // 44×44 touch target for bell
          SizedBox(
            width: 44,
            height: 44,
            child: Material(
              color: AppColors.pageBackground,
              borderRadius: BorderRadius.circular(12),
              child: InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () => widget.onTabSwitch?.call(4),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.cardBorder),
                  ),
                  child: const Icon(
                    Icons.notifications_none_rounded,
                    size: 20,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── 2. HERO CARD ───────────────────────────────────────────────────
  Widget _buildHeroCard({Key? key}) {
    return Padding(
      key: key,
      padding: AppSpacing.screenPadding,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          children: [
            // Triple-tap car name for demo mode
            GestureDetector(
              onTap: _onCarNameTap,
              behavior: HitTestBehavior.opaque,
              child: Column(
                children: [
                  Text(
                    '${mockCar.name} ${mockCar.year}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${mockCar.color} · ${_formatMileage(mockCar.mileage)} km',
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            // Animated health ring (score reacts to demo mode)
            HealthRing(
              score: _demoScore,
              activeColor: _healthColor(_demoScore),
            ),
            const SizedBox(height: 20),
            // Status pills
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _StatusPill(
                  label: 'Brakes ⚠',
                  backgroundColor: AppColors.destructiveLight,
                  textColor: AppColors.destructive,
                ),
                const SizedBox(width: 8),
                _StatusPill(
                  label: 'Battery ✓',
                  backgroundColor: AppColors.successLight,
                  textColor: AppColors.success,
                ),
                const SizedBox(width: 8),
                _StatusPill(
                  label: 'Engine ✓',
                  backgroundColor: AppColors.successLight,
                  textColor: AppColors.success,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // ─── 3. AI SUMMARY CARD ─────────────────────────────────────────────
  Widget _buildAISummaryCard({Key? key}) {
    return Padding(
      key: key,
      padding: AppSpacing.screenPadding,
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 3,
              decoration: BoxDecoration(
                color: AppColors.secondaryLight,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(AppSpacing.cardBorderRadius),
                  topRight: Radius.circular(AppSpacing.cardBorderRadius),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.auto_awesome_rounded,
                          size: 18, color: AppColors.warning),
                      const SizedBox(width: 6),
                      const Text(
                        'What AI found',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        'Powered by Llama 3',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textSecondary.withValues(alpha: 0.7),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  ...mockCar.aiSummary.map(
                    (point) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            margin: const EdgeInsets.only(top: 7),
                            width: 5,
                            height: 5,
                            decoration: const BoxDecoration(
                              color: AppColors.textSecondary,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              point,
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppColors.textPrimary,
                                height: 1.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── 4. QUICK ACTIONS ───────────────────────────────────────────────
  Widget _buildQuickActions() {
    return Padding(
      padding: AppSpacing.screenPadding,
      child: Row(
        children: [
          Expanded(
            child: _QuickActionButton(
              icon: Icons.assessment_rounded,
              label: 'Full Report',
              onTap: () {
                HapticFeedback.lightImpact();
                widget.onTabSwitch?.call(1);
              },
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _QuickActionButton(
              icon: Icons.route_rounded,
              label: 'Trip Check',
              onTap: () {
                HapticFeedback.lightImpact();
                Navigator.of(context).push(slideRoute(const TripCheckScreen()));
              },
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _QuickActionButton(
              icon: Icons.build_circle_rounded,
              label: 'Book Mechanic',
              onTap: () {
                HapticFeedback.mediumImpact();
                widget.onTabSwitch?.call(3);
              },
            ),
          ),
        ],
      ),
    );
  }

  // ─── 5. RECENT ALERTS ───────────────────────────────────────────────
  Widget _buildRecentAlerts() {
    final alerts = mockCar.alerts.take(2).toList();
    return Padding(
      padding: AppSpacing.screenPadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Recent Alerts',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          ...alerts.map((alert) {
            Color dotColor;
            switch (alert.type) {
              case 'critical':
                dotColor = AppColors.destructive;
                break;
              case 'warning':
                dotColor = AppColors.warning;
                break;
              default:
                dotColor = AppColors.primary; // teal for info
            }
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: AppSpacing.cardPadding,
              decoration: BoxDecoration(
                color: AppColors.cardBackground,
                borderRadius:
                    BorderRadius.circular(AppSpacing.cardBorderRadius),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 4),
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: dotColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          alert.title,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          alert.message,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    alert.time,
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textSecondary.withValues(alpha: 0.7),
                    ),
                  ),
                ],
              ),
            );
          }),
          Align(
            alignment: Alignment.centerRight,
            child: GestureDetector(
              onTap: () {
                HapticFeedback.lightImpact();
                widget.onTabSwitch?.call(4);
              },
              child: const Padding(
                padding: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                child: Text(
                  'See all alerts',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── PRIVATE WIDGETS ─────────────────────────────────────────────────

class _StatusPill extends StatelessWidget {
  final String label;
  final Color backgroundColor;
  final Color textColor;

  const _StatusPill({
    required this.label,
    required this.backgroundColor,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: textColor,
        ),
      ),
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.cardBackground,
      borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
        child: Container(
          constraints: const BoxConstraints(minHeight: 44),
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
            border: Border.all(color: AppColors.cardBorder),
          ),
          child: Column(
            children: [
              Icon(icon, size: 24, color: AppColors.textPrimary),
              const SizedBox(height: 8),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
