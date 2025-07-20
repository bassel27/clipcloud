import 'dart:io';

import 'package:mobile/data/models/media.dart';
import 'package:mobile/data/repositories/media_repository.dart';

class MediaService {
  final MediaRepository _repo;

  MediaService(this._repo);

  Future<List<Media>> fetchAllMedia() => _repo.getAllMedia();

  Future<Media> uploadMedia(String title, File file) =>
      _repo.uploadMedia(title: title, file: file);

  Future<Media> toggleLike(String id) => _repo.toggleLike(id);
}
