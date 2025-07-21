import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:mobile/data/models/media.dart';
import 'package:mobile/data/services/auth_service.dart';

class MediaRepository {
  final String baseUrl;
  final AuthService authService;

  MediaRepository({required this.baseUrl, required this.authService});

  Future<List<Media>> getAllMedia() async {
    final headers = await authService.getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/media'),
      headers: headers,
    );
    if (response.statusCode == 200) {
      final List<dynamic> decoded = jsonDecode(
        response.body,
      ); // parses that string into a Dart List or Map structure.
      return decoded.map((json) => Media.fromJson(json)).toList();
    } else {
      throw Exception('Failed to fetch media');
    }
  }

  Future<Media> uploadMedia({required String title, required File file}) async {
    final headers = await authService.getAuthHeaders();

    // 2. Create multipart request
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/media/upload'),
    );

    // 3. Manually set headers (including auth)
    request.headers.addAll(headers);

    request.fields['title'] = title;
    request.files.add(
      await http.MultipartFile.fromPath('media', file.path),
    ); // adds the file to the request. // media is key that the server expects

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      return Media.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to upload media');
    }
  }

  Future<Media> toggleLike(String id) async {
    final headers = await authService.getAuthHeaders();

    final response = await http.post(
      Uri.parse('$baseUrl/media/$id/like'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return Media.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to toggle like');
    }
  }
}
