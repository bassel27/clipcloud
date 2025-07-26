import 'dart:io';
import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:mobile/features/auth/data/repositories/auth_interceptor.dart';
import '../models/media.dart';
import '../../../auth/data/services/auth_service.dart';

class MediaRepository {
  final Dio _dio;

  MediaRepository({required String baseUrl, required AuthService authService})
    : _dio = Dio(BaseOptions(baseUrl: baseUrl)) {
    _dio.interceptors.add(AuthInterceptor(authService));
  }

  Future<List<Media>> getAllMedia() async {
    try {
      final response = await _dio.get('/media');
      return (response.data as List)
          .map((json) => Media.fromJson(json))
          .toList();
    } on DioException catch (e) {
      throw Exception('Failed to fetch media: ${e.message}');
    }
  }

  Future<Media> uploadMedia({required String title, required File file}) async {
    try {
      final response = await _dio.post(
        '/media/upload',
        data: FormData.fromMap({
          'title': title,
          'media': await MultipartFile.fromFile(file.path),
        }),
        options: Options(
          extra: {'isUpload': true, 'title': title, 'filePath': file.path},
        ),
      );
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

  Future<Uint8List> getImageBytes(String imageUrl) async {
    try {
      final response = await _dio.get(
        imageUrl,
        options: Options(responseType: ResponseType.bytes),
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Failed to load image: ${e.message}');
    }
  }
}