import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthRepository {
  final String baseUrl;
  final http.Client client;

  AuthRepository({required this.baseUrl, required this.client});

  Future<Map<String, dynamic>> _makeAuthRequest(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    final response = await client.post(
      Uri.parse('$baseUrl/auth/$endpoint'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(body),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      final Map<String, dynamic> responseBody = jsonDecode(response.body);
      final String message = responseBody['message'] ?? 'No message provided';
      throw Exception('${endpoint.capitalize()} failed: $message');
    }
    return json.decode(response.body);
  }

  Future<Map<String, dynamic>> signIn(String email, String password) async {
    return _makeAuthRequest('signin', {'email': email, 'password': password});
  }

  Future<Map<String, dynamic>> signUp(String email, String password) async {
    return _makeAuthRequest('signup', {'email': email, 'password': password});
  }

  Future<Map<String, dynamic>> refreshToken(String refreshToken) async {
    return _makeAuthRequest('refresh-token', {'token': refreshToken});
  }
}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1)}";
  }
}
