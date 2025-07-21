import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile/constatns.dart';
import 'package:mobile/data/repositories/media_repository.dart';
import 'package:mobile/data/services/media_service.dart';
import 'package:mobile/presentation/screens/media_screen.dart';

void main() async {
  await dotenv.load();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final mediaService = MediaService(
      MediaRepository(baseUrl: kBackendBaseUrl),
    );

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      // title: 'Media Sharing App',
      // theme: ThemeData(
      //   primarySwatch: Colors.blue,
      // ),
      home: MediaPage(mediaService: mediaService),
    );
  }
}
