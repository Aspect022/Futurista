import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';

// ─── ALERT DATA ──────────────────────────────────────────────────────

class _AlertItem {
  final String title;
  final String message;
  final String time;
  final String type;
  bool isRead;

  _AlertItem({
    required this.title,
    required this.message,
    required this.time,
    required this.type,
    this.isRead = false,
  });
}

List<_AlertItem> _buildAlerts() {
  // From mock data
  final fromMock = mockCar.alerts.map((a) => _AlertItem(
        title: a.title,
        message: a.message,
        time: a.time,
        type: a.type,
        isRead: false,
      ));

  // Hardcoded extras
  final extras = [
    _AlertItem(
      title: 'Tyre pressure dropped',
      message:
          'Front-left tyre is 4 PSI below recommended. Check before your next drive.',
      time: '3 days ago',
      type: 'warning',
      isRead: true,
    ),
    _AlertItem(
      title: 'Engine running normally',
      message:
          'Your last engine check came back clean. No action needed.',
      time: '5 days ago',
      type: 'info',
      isRead: true,
    ),
    _AlertItem(
      title: 'Service reminder',
      message:
          'Your next scheduled service is due in approximately 3 weeks.',
      time: '1 week ago',
      type: 'info',
      isRead: true,
    ),
  ];

  return [...fromMock, ...extras];
}

// ─── SCREEN ──────────────────────────────────────────────────────────

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  late List<_AlertItem> _alerts;

  @override
  void initState() {
    super.initState();
    _alerts = _buildAlerts();
  }

  void _markAllRead() {
    setState(() {
      for (final alert in _alerts) {
        alert.isRead = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            const Divider(height: 1, color: AppColors.cardBorder),
            Expanded(
              child: _alerts.isEmpty
                  ? _buildEmptyState()
                  : _buildAlertsList(),
            ),
          ],
        ),
      ),
    );
  }

  // ─── HEADER ─────────────────────────────────────────────────────────
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
                const Text(
                  'Alerts',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Your car\'s recent warnings and updates',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: _markAllRead,
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text(
              'Mark all read',
              style: TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── ALERTS LIST ────────────────────────────────────────────────────
  Widget _buildAlertsList() {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      itemCount: _alerts.length,
      separatorBuilder: (_, _) => const SizedBox(height: 10),
      itemBuilder: (_, i) => _buildAlertCard(_alerts[i]),
    );
  }

  Widget _buildAlertCard(_AlertItem alert) {
    final colors = _alertColors(alert.type);
    final icon = _alertIcon(alert.type);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      decoration: BoxDecoration(
        color: alert.isRead ? AppColors.cardBackground : const Color(0xFFFFF8F8),
        borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Left colored strip
            Container(
              width: 4,
              decoration: BoxDecoration(
                color: colors.strip,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(AppSpacing.cardBorderRadius),
                  bottomLeft: Radius.circular(AppSpacing.cardBorderRadius),
                ),
              ),
            ),
            // Icon
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 14, 4, 14),
              child: Icon(icon, size: 20, color: colors.strip),
            ),
            // Text column
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(8, 14, 12, 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            alert.title,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          alert.time,
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      alert.message,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── EMPTY STATE ─────────────────────────────────────────────────────
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.pageBackground,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: const Icon(
              Icons.notifications_off_rounded,
              size: 36,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'No alerts right now',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Your car is being monitored',
            style: TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────

  _AlertColors _alertColors(String type) {
    switch (type) {
      case 'critical':
        return _AlertColors(strip: AppColors.destructive); // #FF5C5C
      case 'warning':
        return _AlertColors(strip: AppColors.warning);     // #EAB308
      default:
        return _AlertColors(strip: AppColors.primary);     // #00D1BF teal
    }
  }

  IconData _alertIcon(String type) {
    switch (type) {
      case 'critical':
        return Icons.warning_rounded;
      case 'warning':
        return Icons.local_fire_department_rounded;
      default:
        return Icons.info_rounded;
    }
  }
}

class _AlertColors {
  final Color strip;
  const _AlertColors({required this.strip});
}
