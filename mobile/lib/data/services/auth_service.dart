// lib/domain/services/auth_service.dart
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile/data/repositories/auth_repository.dart';

class AuthService with ChangeNotifier {
  final AuthRepository _repo;
  String? _accessToken;
  String? _refreshToken;
  DateTime? _accessTokenExpiry;

  AuthService(this._repo);

  String? get accessToken => _accessToken;
  String? get refreshToken => _refreshToken;
  bool get isAuthenticated =>
      _accessToken != null &&
      (_accessTokenExpiry?.isAfter(DateTime.now()) ?? false);

  Future<void> signIn(String email, String password) async {
    final data = await _repo.signIn(email, password);
    _updateTokens(data['accessToken'], data['refreshToken']);
  }

  Future<void> signUp(String email, String password) async {
    await _repo.signUp(email, password);
    await signIn(email, password);
  }

  Future<void> refreshTokens() async {
    if (_refreshToken == null) {
      logout();
      throw Exception('Session expired - please login again');
    }

    final data = await _repo.refreshToken(_refreshToken!);
    _updateTokens(
      data['accessToken'],
      data['refreshToken'] ??
          _refreshToken, // Keep old refresh token if new one isn't provided
    );
  }

  void _updateTokens(String accessToken, String refreshToken) {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
    _accessTokenExpiry = _parseTokenExpiry(accessToken);
    notifyListeners();
  }

  DateTime _parseTokenExpiry(String token) {
    final parts = token.split(
      '.',
    ); //     // Split into (header.payload.signature)
    if (parts.length != 3) return DateTime.now().add(const Duration(hours: 1));

    final payload = json.decode(
      utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
    );
    return DateTime.fromMillisecondsSinceEpoch(payload['exp'] * 1000);
  }

  void logout() {
    _accessToken = null;
    _refreshToken = null;
    _accessTokenExpiry = null;
    notifyListeners();
  }

  Future<bool> isTokenValid() async {
    if (_accessToken == null) return false;
    return _accessTokenExpiry?.isAfter(DateTime.now()) ?? false;
  }

  Future<Map<String, String>> getAuthHeaders() async {
    if (!await isTokenValid() && _refreshToken != null) {
      await refreshTokens(); // Auto-refresh if token expired
    }
    return {
      'Authorization': 'Bearer $_accessToken',
      'Content-Type': 'application/json',
    };
  }
}
