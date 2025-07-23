import 'dart:io';
import 'dart:typed_data';
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

              // Check if this is an upload request that needs FormData recreation
              if (error.requestOptions.extra['isUpload'] == true) {
                final title = error.requestOptions.extra['title'] as String;
                final filePath =
                    error.requestOptions.extra['filePath'] as String;

                final newFormData = FormData.fromMap({
                  'title': title,
                  'media': await MultipartFile.fromFile(filePath),
                });

                final newOptions = RequestOptions(
                  path: error.requestOptions.path,
                  method: error.requestOptions.method,
                  baseUrl: error.requestOptions.baseUrl,
                  headers: {...error.requestOptions.headers, ...newHeaders},
                  data: newFormData,
                  extra: error.requestOptions.extra,
                );

                final response = await _dio.fetch(newOptions);
                handler.resolve(response);
              } else {
                // For non-upload requests, use the original approach
                final newOptions = RequestOptions(
                  path: error.requestOptions.path,
                  method: error.requestOptions.method,
                  baseUrl: error.requestOptions.baseUrl,
                  headers: {...error.requestOptions.headers, ...newHeaders},
                  queryParameters: error.requestOptions.queryParameters,
                  data: error.requestOptions.data,
                  connectTimeout: error.requestOptions.connectTimeout,
                  receiveTimeout: error.requestOptions.receiveTimeout,
                  sendTimeout: error.requestOptions.sendTimeout,
                  responseType: error.requestOptions.responseType,
                );

                final response = await _dio.fetch(newOptions);
                handler.resolve(response);
              }
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
      // Store file info for potential retry
      final filePath = file.path;

      final response = await _dio.post(
        '/media/upload',
        data: FormData.fromMap({
          'title': title,
          'media': await MultipartFile.fromFile(filePath),
        }),
        options: Options(
          extra: {'isUpload': true, 'title': title, 'filePath': filePath},
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
