// lib/presentation/widgets/authenticated_image.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../data/services/auth_service.dart';

class AuthenticatedImage extends StatelessWidget {
  final String imageUrl;
  final BoxFit? fit;

  const AuthenticatedImage({super.key, required this.imageUrl, this.fit});

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context, listen: false);
    final token = authService.accessToken;

    return Image.network(
      imageUrl,
      headers: token != null ? {'Authorization': 'Bearer $token'} : null,
      fit: fit,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return Center(
          child: CircularProgressIndicator(
            value: loadingProgress.expectedTotalBytes != null
                ? loadingProgress.cumulativeBytesLoaded /
                      loadingProgress.expectedTotalBytes!
                : null,
          ),
        );
      },
      errorBuilder: (context, error, stackTrace) => const Icon(Icons.error),
    );
  }
}
