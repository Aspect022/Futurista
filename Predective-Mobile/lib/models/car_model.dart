// Data models for the Futurista car health system.

enum RiskLevel { critical, high, medium, low, normal }

enum AlertType { critical, warning, info }

class CarComponent {
  final String id;
  final String name;
  final String risk;
  final int daysToFailure;
  final int confidence;
  final String status;
  final String detail;
  final String? estimatedCost;

  const CarComponent({
    required this.id,
    required this.name,
    required this.risk,
    required this.daysToFailure,
    required this.confidence,
    required this.status,
    required this.detail,
    this.estimatedCost,
  });

  RiskLevel get riskLevel {
    switch (risk.toLowerCase()) {
      case 'critical':
        return RiskLevel.critical;
      case 'high':
        return RiskLevel.high;
      case 'medium':
        return RiskLevel.medium;
      case 'low':
        return RiskLevel.low;
      default:
        return RiskLevel.normal;
    }
  }
}

class CarAlert {
  final int id;
  final String title;
  final String message;
  final String time;
  final String type;

  const CarAlert({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.type,
  });

  AlertType get alertType {
    switch (type.toLowerCase()) {
      case 'critical':
        return AlertType.critical;
      case 'warning':
        return AlertType.warning;
      default:
        return AlertType.info;
    }
  }
}

class Car {
  final String id;
  final String name;
  final int year;
  final String color;
  final int mileage;
  final int healthScore;
  final String healthStatus;
  final String lastChecked;
  final List<CarComponent> components;
  final List<String> aiSummary;
  final List<CarAlert> alerts;

  const Car({
    required this.id,
    required this.name,
    required this.year,
    required this.color,
    required this.mileage,
    required this.healthScore,
    required this.healthStatus,
    required this.lastChecked,
    required this.components,
    required this.aiSummary,
    required this.alerts,
  });
}
