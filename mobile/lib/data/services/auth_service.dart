import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/data/repositories/auth_repository.dart';

class AuthService with ChangeNotifier {
  final AuthRepository _repo;
  String? _accessToken;
  String? _refreshToken;

  AuthService(this._repo);

  String? get accessToken => _accessToken;
  String? get refreshToken => _refreshToken;
  bool get isAuthenticated => _accessToken != null;

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
    _updateTokens(data['accessToken'], data['refreshToken']);
  }

  void _updateTokens(String accessToken, String refreshToken) {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
    notifyListeners();
  }

  void logout() {
    _accessToken = null;
    _refreshToken = null;
    notifyListeners();
  }

  Future<Map<String, String>> getAuthHeaders() async {
    return {
      'Authorization': 'Bearer $_accessToken',
      'Content-Type': 'application/json',
    };
  }
}
