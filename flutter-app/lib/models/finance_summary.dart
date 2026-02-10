class FinanceSummary {
  final double income;
  final double expense;
  final double balance;

  FinanceSummary({
    required this.income,
    required this.expense,
    required this.balance,
  });

  factory FinanceSummary.fromJson(Map<String, dynamic> json) {
    return FinanceSummary(
      income: double.parse(json['income'].toString()),
      expense: double.parse(json['expense'].toString()),
      balance: double.parse(json['balance'].toString()),
    );
  }
}