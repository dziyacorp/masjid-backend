class Information {
  final int id;
  final String title;
  final String content;
  final String category;
  final DateTime createdAt;

  Information({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    required this.createdAt,
  });

  factory Information.fromJson(Map<String, dynamic> json) {
    return Information(
      id: json['id'],
      title: json['title'],
      content: json['content'],
      category: json['category'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}