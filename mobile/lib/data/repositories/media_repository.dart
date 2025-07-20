import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:mobile/data/models/media.dart';

class MediaRepository {
  final String baseUrl;

  MediaRepository({required this.baseUrl});

  Future<List<Media>> getAllMedia() async {
    final response = await http.get(Uri.parse('$baseUrl/media'));
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
    final request = http.MultipartRequest(  // Creates a multipart (form-data) request to upload media.
      'POST',
      Uri.parse('$baseUrl/media/upload'),
    );

    request.fields['title'] = title;
    request.files.add(await http.MultipartFile.fromPath('media', file.path)); // adds the file to the request. // media is key that the server expects

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      return Media.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to upload media');
    }
  }

  Future<Media> toggleLike(String id) async {
    final response = await http.post(Uri.parse('$baseUrl/media/$id/like'));

    if (response.statusCode == 200) {
      return Media.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to toggle like');
    }
  }
}
