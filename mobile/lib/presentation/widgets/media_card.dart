import 'package:flutter/material.dart';
import 'package:mobile/constatns.dart';
import 'package:mobile/data/models/media.dart';
import 'package:mobile/presentation/screens/video_player_screen.dart';

class MediaCard extends StatelessWidget {
  final Media media;
  final VoidCallback onLikeToggle;

  const MediaCard({super.key, required this.media, required this.onLikeToggle});

  @override
  Widget build(BuildContext context) {
    final String mediaUrl = '$kBackendBaseUrl/${media.filePath}';
    final String? thumbnailUrl = media.thumbnailPath != null
        ? '$kBackendBaseUrl/${media.thumbnailPath}'
        : null;

    return GestureDetector(
      onTap: () {
        if (media.type == MediaType.video) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => VideoPlayerScreen(videoUrl: mediaUrl),
            ),
          );
        }
      },
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Image.network(
                    thumbnailUrl ?? mediaUrl,
                    width: double.infinity,
                    fit: BoxFit.contain,
                  ),
                  if (media.type == MediaType.video)
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.black45,
                        shape: BoxShape.circle,
                      ),
                      padding: const EdgeInsets.all(8),
                      child: const Icon(
                        Icons.play_arrow,
                        color: Colors.white,
                        size: 48,
                      ),
                    ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      media.title,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      media.isLiked ? Icons.favorite : Icons.favorite_border,
                      color: media.isLiked ? Colors.red : Colors.grey,
                    ),
                    onPressed: onLikeToggle,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
