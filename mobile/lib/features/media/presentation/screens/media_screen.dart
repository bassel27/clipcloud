import 'dart:io';

import 'package:flutter/material.dart';
import 'package:mobile/features/media/data/models/media.dart';
import 'package:mobile/features/media/data/services/media_service.dart';
import 'package:mobile/features/media/presentation/widgets/media_card.dart';
import 'package:file_picker/file_picker.dart';

class MediaPage extends StatefulWidget {
  final MediaService mediaService;

  const MediaPage({super.key, required this.mediaService});

  @override
  State<MediaPage> createState() => _MediaPageState();
}

class _MediaPageState extends State<MediaPage> {
  late Future<List<Media>> _mediaFuture;

  @override
  void initState() {
    super.initState();
    _mediaFuture = widget.mediaService.fetchAllMedia();
  }

  void _toggleLike(Media media) async {
    setState(() {
      media.isLiked = !media.isLiked;
    });

    try {
      await widget.mediaService.toggleLike(media.id);
    } catch (e) {
      setState(() {
        media.isLiked = !media.isLiked;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to update like status'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  void _uploadMedia() async {
    final result = await FilePicker.platform.pickFiles(type: FileType.any);

    if (result != null && result.files.single.path != null) {
      final file = File(result.files.single.path!);

      widget.mediaService
          .uploadMedia('New Media', file)
          .then((media) {
            setState(() {
              _mediaFuture = widget.mediaService.fetchAllMedia();
            });
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Media uploaded successfully'),
                backgroundColor: Colors.green,
              ),
            );
          })
          .catchError((error) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Failed to upload media: $error'),
                backgroundColor: Colors.redAccent,
              ),
            );
          });
    } else {
      // User canceled the picker
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No file selected'),
          backgroundColor: Colors.orange,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          'Media Library',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
        ),
        elevation: 1,
        actions: [
          TextButton.icon(
            onPressed: _uploadMedia,
            icon: const Icon(Icons.upload, color: Colors.black),
            label: const Text('Upload', style: TextStyle(color: Colors.black)),
            style: TextButton.styleFrom(foregroundColor: Colors.black),
          ),
        ],
      ),
      body: FutureBuilder<List<Media>>(
        future: _mediaFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No media found.'));
          }

          final mediaList = snapshot.data!;

          return ListView.separated(
            padding: const EdgeInsets.only(top: 8, bottom: 55),
            itemCount: mediaList.length,
            separatorBuilder: (_, __) => const SizedBox(height: 4),
            itemBuilder: (context, index) {
              final media = mediaList[index];
              return MediaCard(
                media: media,
                onLikeToggle: () => _toggleLike(media),
              );
            },
          );
        },
      ),
    );
  }
}
