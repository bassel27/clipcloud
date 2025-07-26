import 'package:mobile/constatns.dart';

class Media {
  final String id;
  final MediaType type;
  bool isLiked;
  final String createdAt;
  final String urlDelete;
  final String? thumbnailUrlDelete;

  Media({
    required this.id,
    required this.type,
    required this.isLiked,
    required this.createdAt,
    required this.urlDelete,
    this.thumbnailUrlDelete,
  });

  String get url =>
      '$kBackendBaseUrl/${type == MediaType.video ? 'videos' : 'images'}/$id';
  String? get thumbnailUrl =>
      type == MediaType.video ? '$kBackendBaseUrl/thumbnails/$id' : null;

  factory Media.fromJson(Map<String, dynamic> json) {
    return Media(
      id: json['id'],
      type: mediaTypeFromString(json['type']),
      isLiked: json['isLiked'],
      createdAt: json['createdAt'],
      urlDelete: json['url'],
      thumbnailUrlDelete: json['thumbnailUrl'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type.name,
      'isLiked': isLiked,
      'createdAt': createdAt,
      'url': urlDelete,
      'thumbnailUrl': thumbnailUrl,
    };
  }
}

enum MediaType { video, image }

MediaType mediaTypeFromString(String type) {
  switch (type) {
    case 'video':
      return MediaType.video;
    case 'image':
      return MediaType.image;
    default:
      throw Exception('Unknown media type: $type');
  }
}
