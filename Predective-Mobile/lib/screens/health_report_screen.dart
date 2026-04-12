import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../models/car_model.dart';

class HealthReportScreen extends StatefulWidget {
  final void Function(int)? onTabSwitch;

  const HealthReportScreen({super.key, this.onTabSwitch});

  @override
  State<HealthReportScreen> createState() => _HealthReportScreenState();
}

class _HealthReportScreenState extends State<HealthReportScreen>
    with TickerProviderStateMixin {
  final Set<String> _expandedIds = {};

  // Staggered card animation: one controller per component
  late List<AnimationController> _cardControllers;
  late List<Animation<double>> _cardFades;
  late List<Animation<Offset>> _cardSlides;

  static const int _cardCount = 5;
  static const int _staggerMs = 80;
  static const int _cardDurationMs = 320;

  @override
  void initState() {
    super.initState();

    _cardControllers = List.generate(_cardCount, (_) {
      return AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: _cardDurationMs),
      );
    });

    _cardFades = _cardControllers.map((c) {
      return CurvedAnimation(parent: c, curve: Curves.easeOut);
    }).toList();

    _cardSlides = _cardControllers.map((c) {
      return Tween<Offset>(
        begin: const Offset(0, 0.08),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: c, curve: Curves.easeOut));
    }).toList();

    // Stagger the card entrances
    for (var i = 0; i < _cardCount; i++) {
      Future.delayed(Duration(milliseconds: i * _staggerMs), () {
        if (mounted) _cardControllers[i].forward();
      });
    }
  }

  @override
  void dispose() {
    for (final c in _cardControllers) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 16),
              _buildOverallHealthBar(),
              const SizedBox(height: 16),
              _buildComponentCards(),
              const SizedBox(height: 24),
              _buildFooter(),
            ],
          ),
        ),
      ),
    );
  }

  // ─── 1. HEADER ──────────────────────────────────────────────────────
  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Your Car\'s Health Report',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Here\'s what our AI found after checking your car',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 4),
          Text(
            'Last checked: ${mockCar.lastChecked}',
            style: const TextStyle(
              fontSize: 12,
              fontStyle: FontStyle.italic,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  // ─── 2. OVERALL HEALTH BAR ──────────────────────────────────────────
  Widget _buildOverallHealthBar() {
    final score = mockCar.healthScore;
    final criticalCount =
        mockCar.components.where((c) => c.risk == 'Critical').length;
    final highCount =
        mockCar.components.where((c) => c.risk == 'High').length;
    final mediumCount =
        mockCar.components.where((c) => c.risk == 'Medium').length;

    return Padding(
      padding: AppSpacing.screenPadding,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Overall Health',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  '$score%',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: _scoreColor(score),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            ClipRRect(
              borderRadius: BorderRadius.circular(5),
              child: SizedBox(
                height: 10,
                child: LinearProgressIndicator(
                  value: score / 100,
                  backgroundColor: AppColors.muted,
                  valueColor: AlwaysStoppedAnimation(_scoreColor(score)),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _DotLabel(color: AppColors.primary, label: 'Critical: $criticalCount'),
                const SizedBox(width: 16),
                _DotLabel(color: AppColors.warning, label: 'High: $highCount'),
                const SizedBox(width: 16),
                _DotLabel(
                    color: AppColors.primary,
                    label: 'Medium: $mediumCount'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // ─── 3. COMPONENT CARDS (staggered) ─────────────────────────────────
  Widget _buildComponentCards() {
    return Padding(
      padding: AppSpacing.screenPadding,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          children: [
            for (var i = 0; i < mockCar.components.length; i++) ...[
              FadeTransition(
                opacity: _cardFades[i],
                child: SlideTransition(
                  position: _cardSlides[i],
                  child: _buildComponentCard(mockCar.components[i]),
                ),
              ),
              if (i < mockCar.components.length - 1)
                const Divider(
                  height: 0.5,
                  thickness: 0.5,
                  color: AppColors.cardBorder,
                ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildComponentCard(CarComponent component) {
    final isExpanded = _expandedIds.contains(component.id);
    final riskColors = _riskBadgeColors(component.risk);
    final isActionable =
        component.risk == 'Critical' || component.risk == 'High';

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Name + badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  component.name,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: riskColors.bg,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  component.risk,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: riskColors.text,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          // Metric boxes
          Row(
            children: [
              Expanded(
                child: _MetricBox(
                  label: 'Days Left',
                  value: '${component.daysToFailure}',
                  valueColor: _riskValueColor(component.risk),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _MetricBox(
                  label: 'AI Confidence',
                  value: '${component.confidence}%',
                  valueColor: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Expandable detail
          GestureDetector(
            onTap: () {
              HapticFeedback.lightImpact();
              setState(() {
                if (isExpanded) {
                  _expandedIds.remove(component.id);
                } else {
                  _expandedIds.add(component.id);
                }
              });
            },
            child: AnimatedSize(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeInOut,
              alignment: Alignment.topCenter,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isExpanded
                        ? component.detail
                        : _truncate(component.detail, 60),
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textPrimary,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    isExpanded ? 'Show less' : 'Read more',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Action row
          if (isActionable) ...[
            const SizedBox(height: 14),
            _buildActionRow(component),
          ],
        ],
      ),
    );
  }

  Widget _buildActionRow(CarComponent component) {
    final isCritical = component.risk == 'Critical';
    final actionColor = isCritical ? AppColors.destructive : AppColors.warning;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (component.estimatedCost != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Text(
              'Est. ${component.estimatedCost}',
              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
          ),
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 44, // minimum touch target
                child: OutlinedButton(
                  onPressed: () {
                    HapticFeedback.mediumImpact();
                    widget.onTabSwitch?.call(3);
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: actionColor,
                    side: BorderSide(color: actionColor, width: 1.2),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Book a Mechanic',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            TextButton(
              onPressed: () {
                HapticFeedback.lightImpact();
                _shareWithMechanic(component);
              },
              style: TextButton.styleFrom(
                minimumSize: const Size(44, 44),
              ),
              child: const Text(
                'Share with Mechanic',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ─── 4. FOOTER ──────────────────────────────────────────────────────
  Widget _buildFooter() {
    return const Center(
      child: Text(
        'Powered by multi-agent AI · Updated today',
        style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
      ),
    );
  }

  // ─── HELPERS ────────────────────────────────────────────────────────

  void _shareWithMechanic(CarComponent component) {
    final text =
        'Car: ${mockCar.name} ${mockCar.year}\n'
        'Component: ${component.name}\n'
        'Risk: ${component.risk}\n'
        'Days to issue: ${component.daysToFailure} days\n'
        'Note: ${component.detail}\n'
        '— Futurista AI';

    Clipboard.setData(ClipboardData(text: text));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Copied!'),
          duration: const Duration(seconds: 2),
          backgroundColor: AppColors.textPrimary,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        ),
      );
    }
  }

  String _truncate(String text, int maxLength) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength)}...';
  }

  Color _scoreColor(int score) {
    if (score >= 70) return AppColors.success;    // --chart-1 green
    if (score >= 50) return AppColors.warning;    // amber
    return AppColors.destructive;                 // --destructive #FF5C5C
  }

  Color _riskValueColor(String risk) {
    switch (risk) {
      case 'Critical':
        return AppColors.destructive;           // #FF5C5C
      case 'High':
        return AppColors.warning;               // #EAB308
      case 'Medium':
        return AppColors.accent;              // bright blue for medium
      default:
        return AppColors.success;               // #22C55E
    }
  }

  _BadgeColors _riskBadgeColors(String risk) {
    switch (risk) {
      case 'Critical':
        return _BadgeColors(AppColors.destructiveLight, AppColors.destructive);
      case 'High':
        return _BadgeColors(AppColors.warningLight, AppColors.warning);
      case 'Medium':
        return const _BadgeColors(AppColors.primarySurface, AppColors.primary);
      default:
        return _BadgeColors(AppColors.successLight, AppColors.success);
    }
  }
}

// ─── PRIVATE WIDGETS ─────────────────────────────────────────────────

class _BadgeColors {
  final Color bg;
  final Color text;
  const _BadgeColors(this.bg, this.text);
}

class _DotLabel extends StatelessWidget {
  final Color color;
  final String label;
  const _DotLabel({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
        ),
      ],
    );
  }
}

class _MetricBox extends StatelessWidget {
  final String label;
  final String value;
  final Color valueColor;

  const _MetricBox({
    required this.label,
    required this.value,
    required this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.pageBackground,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }
}
