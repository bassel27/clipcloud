import 'dart:io';
import 'package:dio/dio.dart';
import 'package:mobile/data/models/media.dart';
import 'package:mobile/data/services/auth_service.dart';

class MediaRepository {
  final Dio _dio;
  final AuthService authService;

  MediaRepository({required String baseUrl, required this.authService})
    : _dio = Dio(BaseOptions(baseUrl: baseUrl)) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final headers = await authService.getAuthHeaders();
          options.headers.addAll(headers);
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401 ||
              error.response?.statusCode == 403) {
            try {
              await authService.refreshTokens();

              final newHeaders = await authService.getAuthHeaders();

              error.requestOptions.headers.addAll(newHeaders);

              final response = await _dio.fetch(error.requestOptions);
              handler.resolve(response);
            } catch (refreshError) {
              print('Token refresh failed: $refreshError');
              handler.next(error);
            }
          } else {
            handler.next(error);
          }
        },
      ),
    );
  }

  Future<List<Media>> getAllMedia() async {
    try {
      final response = await _dio.get('/media');
      final List<dynamic> data = response.data;
      return data.map((json) => Media.fromJson(json)).toList();
    } on DioException catch (e) {
      throw Exception('Failed to fetch media: ${e.message}');
    }
  }

  Future<Media> uploadMedia({required String title, required File file}) async {
    try {
      final formData = FormData.fromMap({
        'title': title,
        'media': await MultipartFile.fromFile(file.path),
      });

      final response = await _dio.post('/media/upload', data: formData);

      return Media.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to upload media: ${e.message}');
    }
  }

  Future<Media> toggleLike(String id) async {
    try {
      final response = await _dio.post('/media/$id/like');
      return Media.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to toggle like: ${e.message}');
    }
  }
}
