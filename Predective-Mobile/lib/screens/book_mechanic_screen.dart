import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';

// ─── STATIC DATA ─────────────────────────────────────────────────────

const List<String> _serviceTypes = [
  'Brake Inspection',
  'Oil Change',
  'Battery Check',
  'Full Service',
  'Tyre Check',
];

const List<_ServiceCentre> _centres = [
  _ServiceCentre(name: 'AutoCare Pro', distance: '2.3 km', rating: '4.8', status: 'Open now'),
  _ServiceCentre(name: 'Speedy Motors', distance: '4.1 km', rating: '4.5', status: 'Open now'),
  _ServiceCentre(name: 'City Garage', distance: '6.7 km', rating: '4.2', status: 'Closes at 6 PM'),
];

const List<String> _timeSlots = [
  '9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM',
];

const Set<String> _bookedSlots = {'10:30 AM', '2:00 PM'};

// ─── SCREEN ──────────────────────────────────────────────────────────

class BookMechanicScreen extends StatefulWidget {
  const BookMechanicScreen({super.key});

  @override
  State<BookMechanicScreen> createState() => _BookMechanicScreenState();
}

class _BookMechanicScreenState extends State<BookMechanicScreen> {
  String _selectedService = 'Brake Inspection';
  int _selectedDateIndex = 2; // day after tomorrow by default
  String? _selectedTime;
  int _selectedCentreIndex = 0;

  List<DateTime> get _next7Days {
    final today = DateTime.now();
    return List.generate(7, (i) => today.add(Duration(days: i + 1)));
  }

  String _formatDate(DateTime date) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[date.weekday - 1];
  }

  String _formatDateNum(DateTime date) => date.day.toString();

  String get _selectedDateLabel {
    final days = _next7Days;
    final d = days[_selectedDateIndex];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${_formatDate(d)}, ${d.day} ${months[d.month - 1]}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 16),
              _buildPreFilledCard(),
              const SizedBox(height: 20),
              _buildSection('Service Type', _buildServiceChips()),
              const SizedBox(height: 20),
              _buildSection('Select Date', _buildDateChips()),
              const SizedBox(height: 20),
              _buildSection('Select Time', _buildTimeGrid()),
              const SizedBox(height: 20),
              _buildSection('Nearby Service Centres', _buildCentresList()),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildConfirmBar(context),
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
            'Book a Mechanic',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Get your car checked at a nearby service centre',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  // ─── 2. PRE-FILLED SERVICE CARD ─────────────────────────────────────
  Widget _buildPreFilledCard() {
    return Padding(
      padding: AppSpacing.screenPadding,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Amber top accent
            Container(
              height: 3,
              decoration: const BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(AppSpacing.cardBorderRadius),
                  topRight: Radius.circular(AppSpacing.cardBorderRadius),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Recommended Service',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.3,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _InfoChip(
                        label: 'Brake Inspection',
                        bgColor: AppColors.primarySurface,
                        textColor: AppColors.primary,
                      ),
                      _InfoChip(
                        label: 'Toyota Innova 2021',
                        bgColor: AppColors.pageBackground,
                        textColor: AppColors.textSecondary,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(Icons.warning_amber_rounded,
                          size: 14, color: AppColors.primary),
                      const SizedBox(width: 6),
                      const Expanded(
                        child: Text(
                          'Brake pads at critical risk — 12 days left',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── SECTION WRAPPER ─────────────────────────────────────────────────
  Widget _buildSection(String title, Widget child) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
        child,
      ],
    );
  }

  // ─── 3. SERVICE TYPE CHIPS ───────────────────────────────────────────
  Widget _buildServiceChips() {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _serviceTypes.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (_, i) {
          final selected = _serviceTypes[i] == _selectedService;
          return GestureDetector(
            onTap: () {
              HapticFeedback.lightImpact();
              setState(() => _selectedService = _serviceTypes[i]);
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: selected ? AppColors.primary : AppColors.cardBackground,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: selected ? AppColors.primary : AppColors.cardBorder,
                ),
              ),
              child: Text(
                _serviceTypes[i],
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: selected ? Colors.white : AppColors.textPrimary,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── 4. DATE CHIPS ───────────────────────────────────────────────────
  Widget _buildDateChips() {
    final days = _next7Days;
    return SizedBox(
      height: 66,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: days.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (_, i) {
          final selected = i == _selectedDateIndex;
          final day = days[i];
          return GestureDetector(
            onTap: () {
              HapticFeedback.lightImpact();
              setState(() => _selectedDateIndex = i);
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 52,
              decoration: BoxDecoration(
                color: selected ? AppColors.primary : AppColors.cardBackground,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: selected ? AppColors.primary : AppColors.cardBorder,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    _formatDate(day),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: selected ? Colors.white70 : AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatDateNum(day),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: selected ? Colors.white : AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── 5. TIME SLOT GRID ───────────────────────────────────────────────
  Widget _buildTimeGrid() {
    return Padding(
      padding: AppSpacing.screenPadding,
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 3.2,
        ),
        itemCount: _timeSlots.length,
        itemBuilder: (_, i) {
          final slot = _timeSlots[i];
          final booked = _bookedSlots.contains(slot);
          final selected = slot == _selectedTime;

          return GestureDetector(
            onTap: booked
                ? null
                : () {
                    HapticFeedback.lightImpact();
                    setState(() => _selectedTime = slot);
                  },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: booked
                    ? AppColors.muted
                    : selected
                        ? AppColors.primary
                        : AppColors.cardBackground,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: booked
                      ? AppColors.cardBorder
                      : selected
                          ? AppColors.primary
                          : AppColors.cardBorder,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    slot,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: booked
                          ? AppColors.textSecondary.withValues(alpha: 0.4)
                          : selected
                              ? Colors.white
                              : AppColors.textPrimary,
                    ),
                  ),
                  if (booked)
                    Text(
                      'Fully Booked',
                      style: TextStyle(
                        fontSize: 9,
                        color: AppColors.textSecondary.withValues(alpha: 0.4),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── 6. NEARBY CENTRES ───────────────────────────────────────────────
  Widget _buildCentresList() {
    return Padding(
      padding: AppSpacing.screenPadding,
      child: Column(
        children: List.generate(_centres.length, (i) {
          final centre = _centres[i];
          final selected = i == _selectedCentreIndex;
          return GestureDetector(
            onTap: () => setState(() => _selectedCentreIndex = i),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.cardBackground,
                borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
                border: Border.all(
                  color: selected ? AppColors.primary : AppColors.cardBorder,
                  width: selected ? 1.5 : 1,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: selected
                          ? AppColors.primary.withValues(alpha: 0.1)
                          : AppColors.pageBackground,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.build_rounded,
                      size: 20,
                      color: selected
                          ? AppColors.primary
                          : AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          centre.name,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              centre.distance,
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text('⭐',
                                style: TextStyle(fontSize: 11)),
                            const SizedBox(width: 2),
                            Text(
                              centre.rating,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: centre.status == 'Open now'
                          ? AppColors.successLight
                          : AppColors.pageBackground,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      centre.status,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: centre.status == 'Open now'
                            ? AppColors.success
                            : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }

  // ─── 7. CONFIRM BUTTON ───────────────────────────────────────────────
  Widget _buildConfirmBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: const BoxDecoration(
        color: AppColors.cardBackground,
        border: Border(
          top: BorderSide(color: AppColors.cardBorder, width: 0.5),
        ),
      ),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: () {
            HapticFeedback.mediumImpact();
            _showSuccessModal(context);
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.cardBorderRadius),
            ),
            elevation: 0,
          ),
          child: const Text(
            'Confirm Booking',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
          ),
        ),
      ),
    );
  }

  // ─── SUCCESS MODAL ───────────────────────────────────────────────────
  void _showSuccessModal(BuildContext context) {
    final centre = _centres[_selectedCentreIndex];
    final time = _selectedTime ?? '9:00 AM';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SuccessModal(
        service: _selectedService,
        centre: centre.name,
        date: _selectedDateLabel,
        time: time,
      ),
    );
  }
}

// ─── SUCCESS MODAL ───────────────────────────────────────────────────

class _SuccessModal extends StatefulWidget {
  final String service;
  final String centre;
  final String date;
  final String time;

  const _SuccessModal({
    required this.service,
    required this.centre,
    required this.date,
    required this.time,
  });

  @override
  State<_SuccessModal> createState() => _SuccessModalState();
}

class _SuccessModalState extends State<_SuccessModal>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _scaleAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ScaleTransition(
            scale: _scaleAnimation,
            child: Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                color: AppColors.successLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_rounded,
                size: 40,
                color: AppColors.success,
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Booking Confirmed!',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            '${widget.service} · ${widget.centre}\n${widget.date} · ${widget.time}',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.pageBackground,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Row(
              children: [
                Icon(Icons.notifications_rounded,
                    size: 16, color: AppColors.textSecondary),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'You\'ll receive a reminder 2 hours before your appointment.',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                HapticFeedback.heavyImpact();
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: const Text(
                'Done',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── DATA MODELS ─────────────────────────────────────────────────────

class _ServiceCentre {
  final String name;
  final String distance;
  final String rating;
  final String status;

  const _ServiceCentre({
    required this.name,
    required this.distance,
    required this.rating,
    required this.status,
  });
}

class _InfoChip extends StatelessWidget {
  final String label;
  final Color bgColor;
  final Color textColor;

  const _InfoChip({
    required this.label,
    required this.bgColor,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.cardBorder),
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
