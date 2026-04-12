import '../models/car_model.dart';

/// Mock data for the Futurista app — matches the spec exactly.
const Car mockCar = Car(
  id: 'car-3',
  name: 'Toyota Innova',
  year: 2021,
  color: 'Pearl White',
  mileage: 42800,
  healthScore: 48,
  healthStatus: 'Needs Attention',
  lastChecked: 'Today at 9:14 AM',
  components: [
    CarComponent(
      id: 'brakes',
      name: 'Brake Pads',
      risk: 'Critical',
      daysToFailure: 12,
      confidence: 95,
      status: 'Needs Attention',
      detail:
          'Your brake pads have worn thin from city driving. You might hear squeaking when stopping.',
      estimatedCost: '₹1,800 – ₹3,500',
    ),
    CarComponent(
      id: 'air-filter',
      name: 'Air Filter',
      risk: 'High',
      daysToFailure: 18,
      confidence: 88,
      status: 'Needs Attention',
      detail:
          'Your air filter is getting clogged. Your engine may feel less responsive soon.',
      estimatedCost: '₹400 – ₹900',
    ),
    CarComponent(
      id: 'transmission',
      name: 'Transmission',
      risk: 'Medium',
      daysToFailure: 25,
      confidence: 74,
      status: 'Watch This',
      detail:
          'Minor fluid degradation detected. Keep an eye on gear smoothness.',
      estimatedCost: '₹2,000 – ₹5,000',
    ),
    CarComponent(
      id: 'battery',
      name: 'Battery',
      risk: 'Low',
      daysToFailure: 90,
      confidence: 91,
      status: 'Good',
      detail: 'Battery is charging well and holding voltage correctly.',
      estimatedCost: null,
    ),
    CarComponent(
      id: 'engine',
      name: 'Engine',
      risk: 'Normal',
      daysToFailure: 180,
      confidence: 97,
      status: 'Great',
      detail:
          'Engine is running smoothly within all normal parameters.',
      estimatedCost: null,
    ),
  ],
  aiSummary: [
    'Your brake pads have about 12 days before they need replacing — book a check soon.',
    'Your battery is stable and charging normally — no action needed.',
    'Everything else looks good — your engine and tyres are in healthy condition.',
  ],
  alerts: [
    CarAlert(
      id: 1,
      title: 'Brake pads wearing fast',
      message:
          'Your brake pads have worn 8% in the last week. A check-up this week is recommended.',
      time: '2 hours ago',
      type: 'critical',
    ),
    CarAlert(
      id: 2,
      title: 'AI analysis complete',
      message: '3 components checked. 1 needs your attention soon.',
      time: '2 hours ago',
      type: 'info',
    ),
    CarAlert(
      id: 3,
      title: 'Oil got hotter than usual',
      message:
          'Oil temperature spiked during your last drive. Avoid long motorway drives this week.',
      time: 'Yesterday',
      type: 'warning',
    ),
  ],
);
