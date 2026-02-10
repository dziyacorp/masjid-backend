import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/prayer_schedule.dart';
import '../models/information.dart';
import '../models/finance.dart';
import '../models/news.dart';
import '../models/finance_summary.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3000/api'; // Untuk Android Emulator
  // static const String baseUrl = 'http://localhost:3000/api'; // Untuk iOS Simulator
  // static const String baseUrl = 'http://YOUR_IP:3000/api'; // Untuk device fisik

  // Headers
  Map<String, String> _headers(String? token) {
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // ========== AUTH ========== 
  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: _headers(null),
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Login gagal: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // ========== PUBLIC DATA ==========
  // Get prayer schedule
  Future<PrayerSchedule> getPrayerSchedule() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/public/schedule'),
        headers: _headers(null),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] && data['data'] != null) {
          return PrayerSchedule.fromJson(data['data']);
        }
        throw Exception('Data tidak tersedia');
      } else {
        throw Exception('Gagal memuat jadwal: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // Get information
  Future<List<Information>> getInformation([String? category]) async {
    try {
      String url = '$baseUrl/public/information';
      if (category != null) {
        url += '?category=$category';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: _headers(null),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] && data['data'] != null) {
          return List<Information>.from(
            data['data'].map((x) => Information.fromJson(x)),
          );
        }
        return [];
      } else {
        throw Exception('Gagal memuat informasi');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // Get finance summary
  Future<FinanceSummary> getFinanceSummary(int year, int month) async {
    try {
      final response = await http.get(
        Uri.parse(
          '$baseUrl/public/finance/summary?year=$year&month=${month.toString().padLeft(2, '0')}',
        ),
        headers: _headers(null),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] && data['data'] != null) {
          return FinanceSummary.fromJson(data['data']);
        }
        throw Exception('Data tidak tersedia');
      } else {
        throw Exception('Gagal memuat laporan keuangan');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // Get news
  Future<List<News>> getNews({int limit = 10}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/public/news?limit=$limit'),
        headers: _headers(null),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] && data['data'] != null) {
          return List<News>.from(
            data['data'].map((x) => News.fromJson(x)),
          );
        }
        return [];
      } else {
        throw Exception('Gagal memuat berita');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // ========== ADMIN DATA ==========
  // Get all finances (admin only)
  Future<List<Finance>> getFinances(String token, {String? type}) async {
    try {
      String url = '$baseUrl/admin/finance';
      if (type != null) {
        url += '?type=$type';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: _headers(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] && data['data'] != null) {
          return List<Finance>.from(
            data['data'].map((x) => Finance.fromJson(x)),
          );
        }
        return [];
      } else {
        throw Exception('Gagal memuat data keuangan');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // Create finance record
  Future<bool> createFinance(
    String token,
    Map<String, dynamic> financeData,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/admin/finance'),
        headers: _headers(token),
        body: jsonEncode(financeData),
      );

      return response.statusCode == 201;
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // Update finance record
  Future<bool> updateFinance(
    String token,
    int id,
    Map<String, dynamic> financeData,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/admin/finance/$id'),
        headers: _headers(token),
        body: jsonEncode(financeData),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // Delete finance record
  Future<bool> deleteFinance(String token, int id) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/admin/finance/$id'),
        headers: _headers(token),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}