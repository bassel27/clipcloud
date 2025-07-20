class Media {
  final String id;
  final String title;
  final String filePath;
  final String? thumbnailPath;
  bool isLiked;
  final String timeCreated;
  final MediaType type;

  Media({
    required this.id,
    required this.title,
    required this.filePath,
    this.thumbnailPath,
    required this.isLiked,
    required this.timeCreated,
    required this.type,
  });

  factory Media.fromJson(Map<String, dynamic> json) {
    return Media(
      id: json['id'],
      title: json['title'],
      filePath: json['filePath'],
      thumbnailPath: json['thumbnailPath'],
      isLiked: json['isLiked'],
      timeCreated: json['timeCreated'],
      type: mediaTypeFromString(json['type']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'filePath': filePath,
      'thumbnailPath': thumbnailPath,
      'isLiked': isLiked,
      'timeCreated': timeCreated,
      'type': type.name,
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
