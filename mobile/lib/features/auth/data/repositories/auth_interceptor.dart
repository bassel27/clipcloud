import 'package:dio/dio.dart';
import '../services/auth_service.dart';

class DioFactory {
  final Dio dio;

  DioFactory({required String baseUrl, required AuthService authService})
    : dio = Dio(BaseOptions(baseUrl: baseUrl)) {
    dio.interceptors.add(AuthInterceptor(authService));
  }
}

class AuthInterceptor extends Interceptor {
  final AuthService authService;

  AuthInterceptor(this.authService);

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final headers = await authService.getAuthHeaders();
    options.headers.addAll(headers);
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (_shouldRetryWithRefresh(err)) {
      try {
        await authService.refreshTokens();
        final response = await _retryRequest(err);
        handler.resolve(response);
        return;
      } catch (refreshError) {
        print('Token refresh failed: $refreshError');
      }
    }
    handler.next(err);
  }

  bool _shouldRetryWithRefresh(DioException err) {
    return err.response?.statusCode == 401 || err.response?.statusCode == 403;
  }

  Future<Response> _retryRequest(DioException err) async {
    final newHeaders = await authService.getAuthHeaders();
    final options = err.requestOptions;

    return Dio().fetch(
      RequestOptions(
        path: options.path,
        method: options.method,
        baseUrl: options.baseUrl,
        headers: {...options.headers, ...newHeaders},
        queryParameters: options.queryParameters,
        data: _isUploadRequest(options)
            ? await _recreateFormData(options)
            : options.data,
        connectTimeout: options.connectTimeout,
        receiveTimeout: options.receiveTimeout,
        sendTimeout: options.sendTimeout,
        responseType: options.responseType,
        extra: options.extra,
      ),
    );
  }

  bool _isUploadRequest(RequestOptions options) {
    return options.extra['isUpload'] == true;
  }

  Future<FormData> _recreateFormData(RequestOptions options) async {
    final title = options.extra['title'] as String;
    final filePath = options.extra['filePath'] as String;

    return FormData.fromMap({
      'title': title,
      'media': await MultipartFile.fromFile(filePath),
    });
  }
}
