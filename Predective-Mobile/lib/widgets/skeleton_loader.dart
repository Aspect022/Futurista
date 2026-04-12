import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

// ─── SHIMMER BOX ─────────────────────────────────────────────────────

class ShimmerBox extends StatefulWidget {
  final double width;
  final double height;
  final double borderRadius;

  const ShimmerBox({
    super.key,
    this.width = double.infinity,
    required this.height,
    this.borderRadius = 6,
  });

  @override
  State<ShimmerBox> createState() => _ShimmerBoxState();
}

class _ShimmerBoxState extends State<ShimmerBox>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);

    _opacityAnimation = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacityAnimation,
      child: Container(
        width: widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          color: AppColors.cardBorder,
          borderRadius: BorderRadius.circular(widget.borderRadius),
        ),
      ),
    );
  }
}

// ─── SKELETON HERO CARD ──────────────────────────────────────────────

class SkeletonHeroCard extends StatelessWidget {
  const SkeletonHeroCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: AppSpacing.screenPadding,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          children: [
            // Title line
            const ShimmerBox(width: 160, height: 18, borderRadius: 6),
            const SizedBox(height: 8),
            // Subtitle line
            const ShimmerBox(width: 120, height: 13, borderRadius: 4),
            const SizedBox(height: 24),
            // Ring placeholder
            Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: AppColors.cardBorder,
                  width: 12,
                ),
              ),
              child: _PulsingCircle(),
            ),
            const SizedBox(height: 20),
            // Pill row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                ShimmerBox(width: 80, height: 28, borderRadius: 20),
                SizedBox(width: 8),
                ShimmerBox(width: 72, height: 28, borderRadius: 20),
                SizedBox(width: 8),
                ShimmerBox(width: 72, height: 28, borderRadius: 20),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ─── SKELETON AI SUMMARY CARD ────────────────────────────────────────

class SkeletonAISummaryCard extends StatelessWidget {
  const SkeletonAISummaryCard({super.key});

  @override
  Widget build(BuildContext context) {
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
            // Header
            Row(
              children: const [
                ShimmerBox(width: 18, height: 18, borderRadius: 4),
                SizedBox(width: 8),
                ShimmerBox(width: 100, height: 14, borderRadius: 4),
                Spacer(),
                ShimmerBox(width: 80, height: 11, borderRadius: 4),
              ],
            ),
            const SizedBox(height: 16),
            // 3 shimmer lines
            const ShimmerBox(height: 13),
            const SizedBox(height: 8),
            const ShimmerBox(height: 13, width: 240),
            const SizedBox(height: 8),
            const ShimmerBox(height: 13, width: 200),
          ],
        ),
      ),
    );
  }
}

// ─── PULSING CIRCLE CENTER ───────────────────────────────────────────

class _PulsingCircle extends StatefulWidget {
  @override
  State<_PulsingCircle> createState() => _PulsingCircleState();
}

class _PulsingCircleState extends State<_PulsingCircle>
    with SingleTickerProviderStateMixin {
  late AnimationController _c;
  late Animation<double> _a;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 900))
      ..repeat(reverse: true);
    _a = Tween<double>(begin: 0.4, end: 1.0)
        .animate(CurvedAnimation(parent: _c, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FadeTransition(
        opacity: _a,
        child: Container(
          width: 50,
          height: 20,
          decoration: BoxDecoration(
            color: AppColors.cardBorder,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
      ),
    );
  }
}
