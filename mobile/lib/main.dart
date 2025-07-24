import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart' show dotenv;
import 'package:http/http.dart' as http;
import 'package:mobile/constatns.dart';
import 'package:mobile/data/repositories/auth_repository.dart';
import 'package:mobile/data/repositories/media_repository.dart';
import 'package:mobile/data/services/media_service.dart';
import 'package:provider/provider.dart';
import 'package:mobile/data/services/auth_service.dart';
import 'package:mobile/presentation/screens/auth_screen.dart';
import 'package:mobile/presentation/screens/media_screen.dart';

void main() async {
  await dotenv.load(fileName: ".env.mobile");

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => AuthService(
            AuthRepository(baseUrl: kBackendBaseUrl, client: http.Client()),
          ),
        ),
        Provider(
          create: (context) => MediaRepository(
            baseUrl: kBackendBaseUrl,
            authService: context.read<AuthService>(),
          ),
        ),
        Provider(
          create: (context) => MediaService(context.read<MediaRepository>()),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: Consumer<AuthService>(
        builder: (context, auth, child) {
          return auth.isAuthenticated
              ? MediaPage(mediaService: context.read<MediaService>())
              : const AuthScreen();
        },
      ),
    );
  }
}
