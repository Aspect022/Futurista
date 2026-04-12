import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'book_mechanic_screen.dart';

class TripCheckScreen extends StatefulWidget {
  const TripCheckScreen({super.key});

  @override
  State<TripCheckScreen> createState() => _TripCheckScreenState();
}

class _TripCheckScreenState extends State<TripCheckScreen>
    with SingleTickerProviderStateMixin {
  final TextEditingController _fromController = TextEditingController();
  final TextEditingController _toController = TextEditingController();

  double _distance = 200;
  int _passengers = 2;
  bool _showResult = false;

  late AnimationController _slideController;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _fadeAnimation;

  // Mock car health from mockData
  static const int _healthScore = 48;

  @override
  void initState() {
    super.initState();
    _slideController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideController, curve: Curves.easeOut));
    _fadeAnimation = CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeIn,
    );
  }

  @override
  void dispose() {
    _fromController.dispose();
    _toController.dispose();
    _slideController.dispose();
    super.dispose();
  }

  void _onCheckCar() {
    FocusScope.of(context).unfocus();
    setState(() => _showResult = true);
    _slideController.forward(from: 0);
  }

  _TripResult _getTripResult() {
    final dist = _distance;
    if (dist <= 200 && _healthScore >= 70) {
      return _TripResult.go;
    } else if (dist > 400 || _healthScore < 50) {
      return _TripResult.caution;
    } else {
      return _TripResult.actionRequired;
    }
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
              _buildHeader(context),
              const SizedBox(height: 16),
              _buildInputCard(),
              if (_showResult) ...[
                const SizedBox(height: 16),
                _buildResultCard(),
              ],
            ],
          ),
        ),
      ),
    );
  }

  // ─── HEADER ─────────────────────────────────────────────────────────
  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
            color: AppColors.textPrimary,
            onPressed: () => Navigator.of(context).pop(),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Road Trip Safety Check',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Planning a trip? Let\'s make sure your car can handle it.',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── INPUT CARD ─────────────────────────────────────────────────────
  Widget _buildInputCard() {
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // From field
            _buildTextField(
              controller: _fromController,
              label: 'From',
              placeholder: 'Starting location',
              icon: Icons.my_location_rounded,
            ),
            const SizedBox(height: 12),

            // To field
            _buildTextField(
              controller: _toController,
              label: 'To',
              placeholder: 'Destination',
              icon: Icons.location_on_rounded,
            ),
            const SizedBox(height: 20),

            // Distance slider
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Distance',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    '${_distance.round()} km',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            SliderTheme(
              data: SliderTheme.of(context).copyWith(
                activeTrackColor: AppColors.primary,
                inactiveTrackColor: AppColors.muted,
                thumbColor: AppColors.primary,
                overlayColor: AppColors.primary.withValues(alpha: 0.15),
                thumbShape:
                    const RoundSliderThumbShape(enabledThumbRadius: 8),
                trackHeight: 4,
              ),
              child: Slider(
                value: _distance,
                min: 50,
                max: 1000,
                divisions: 19,
                onChanged: (v) => setState(() => _distance = v),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('50 km',
                    style: TextStyle(
                        fontSize: 11, color: AppColors.textSecondary)),
                Text('1000 km',
                    style: TextStyle(
                        fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
            const SizedBox(height: 20),

            // Passengers stepper
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Passengers',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                Row(
                  children: [
                    _StepperButton(
                      icon: Icons.remove,
                      onTap: () {
                        if (_passengers > 1) {
                          setState(() => _passengers--);
                        }
                      },
                    ),
                    Container(
                      width: 44,
                      alignment: Alignment.center,
                      child: Text(
                        '$_passengers',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                    _StepperButton(
                      icon: Icons.add,
                      onTap: () {
                        if (_passengers < 6) {
                          setState(() => _passengers++);
                        }
                      },
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Check My Car button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _onCheckCar,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(AppSpacing.cardBorderRadius),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Check My Car',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String placeholder,
    required IconData icon,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textPrimary,
          ),
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: const TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
            prefixIcon: Icon(icon, size: 18, color: AppColors.textSecondary),
            filled: true,
            fillColor: AppColors.pageBackground,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.cardBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.cardBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide:
                  const BorderSide(color: AppColors.primary, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }

  // ─── RESULT CARD ────────────────────────────────────────────────────
  Widget _buildResultCard() {
    final result = _getTripResult();
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: Padding(
          padding: AppSpacing.screenPadding,
          child: Container(
            decoration: BoxDecoration(
              color: AppColors.cardBackground,
              borderRadius:
                  BorderRadius.circular(AppSpacing.cardBorderRadius),
              border: Border.all(color: _resultBorderColor(result)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Colored top accent
                Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: _resultAccentColor(result),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(AppSpacing.cardBorderRadius),
                      topRight: Radius.circular(AppSpacing.cardBorderRadius),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: _buildResultContent(result),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResultContent(_TripResult result) {
    switch (result) {
      case _TripResult.go:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _ResultStatusBadge(
              label: '✓  GO',
              color: AppColors.success,
              bgColor: AppColors.successLight,
            ),
            const SizedBox(height: 12),
            const Text(
              'Your car is ready for this trip. Have a safe drive!',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textPrimary,
                height: 1.5,
              ),
            ),
          ],
        );

      case _TripResult.caution:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _ResultStatusBadge(
              label: '⚠  CAUTION',
              color: AppColors.warning,
              bgColor: AppColors.warningLight,
            ),
            const SizedBox(height: 12),
            const Text(
              'Your car can make this trip but your brake pads need attention first. '
              'We recommend a brake inspection before any long drive.',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textPrimary,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 16),
            _ChecklistItem(
                ok: false, label: 'Brake pads', note: 'Replace before long trips (Critical)'),
            _ChecklistItem(ok: true, label: 'Battery', note: 'Good for this distance'),
            _ChecklistItem(ok: true, label: 'Engine', note: 'Good for this distance'),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const BookMechanicScreen(),
                    ),
                  );
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.warning,
                  side: const BorderSide(color: AppColors.warning, width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text(
                  'Book Brake Inspection',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ],
        );

      case _TripResult.actionRequired:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _ResultStatusBadge(
              label: '⚠  ACTION REQUIRED',
              color: AppColors.primary,
              bgColor: AppColors.destructiveLight,
            ),
            const SizedBox(height: 12),
            const Text(
              'We recommend fixing your brake pads before this trip for safety.',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textPrimary,
                height: 1.5,
              ),
            ),
          ],
        );
    }
  }

  Color _resultBorderColor(_TripResult result) {
    switch (result) {
      case _TripResult.go:
        return AppColors.successLight;
      case _TripResult.caution:
        return AppColors.warningLight;
      case _TripResult.actionRequired:
        return AppColors.destructiveLight;
    }
  }

  Color _resultAccentColor(_TripResult result) {
    switch (result) {
      case _TripResult.go:
        return AppColors.success;
      case _TripResult.caution:
        return AppColors.warning;
      case _TripResult.actionRequired:
        return AppColors.primary;
    }
  }
}

enum _TripResult { go, caution, actionRequired }

// ─── PRIVATE WIDGETS ─────────────────────────────────────────────────

class _StepperButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _StepperButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: AppColors.pageBackground,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Icon(icon, size: 16, color: AppColors.textPrimary),
      ),
    );
  }
}

class _ResultStatusBadge extends StatelessWidget {
  final String label;
  final Color color;
  final Color bgColor;

  const _ResultStatusBadge({
    required this.label,
    required this.color,
    required this.bgColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w800,
          color: color,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class _ChecklistItem extends StatelessWidget {
  final bool ok;
  final String label;
  final String note;

  const _ChecklistItem({
    required this.ok,
    required this.label,
    required this.note,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 1),
            child: Icon(
              ok ? Icons.check_circle_rounded : Icons.cancel_rounded,
              size: 18,
              color: ok ? AppColors.success : AppColors.primary,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: '$label — ',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  TextSpan(
                    text: note,
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
