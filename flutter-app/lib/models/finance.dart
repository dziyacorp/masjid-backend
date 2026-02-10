class Finance {
  final int id;
  final DateTime date;
  final String type; // 'income' or 'expense'
  final double amount;
  final String source;
  final String? description;
  final DateTime createdAt;

  Finance({
    required this.id,
    required this.date,
    required this.type,
    required this.amount,
    required this.source,
    this.description,
    required this.createdAt,
  });

  factory Finance.fromJson(Map<String, dynamic> json) {
    return Finance(
      id: json['id'],
      date: DateTime.parse(json['date']),
      type: json['type'],
      amount: double.parse(json['amount'].toString()),
      source: json['source'],
      description: json['description'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  bool get isIncome => type == 'income';
}