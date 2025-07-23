import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class VideoPlayerScreen extends StatefulWidget {
  final String videoUrl;
  final String? authToken;

  const VideoPlayerScreen({super.key, required this.videoUrl, this.authToken});

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  late VideoPlayerController _controller;
  bool _isInitialized = false;
  bool _hasError = false;
  bool _isPlaying = false;

  @override
  void initState() {
    super.initState();
    _initializeVideoPlayer();
  }

  Future<void> _initializeVideoPlayer() async {
    try {
      final headers = widget.authToken != null
          ? {'Authorization': 'Bearer ${widget.authToken}'}
          : <String, String>{};

      _controller =
          VideoPlayerController.network(widget.videoUrl, httpHeaders: headers)
            ..addListener(_videoStateListener)
            ..initialize()
                .then((_) {
                  if (mounted) {
                    setState(() {
                      _isInitialized = true;
                    });
                    _controller.play();
                  }
                })
                .catchError((_) {
                  if (mounted) {
                    setState(() {
                      _hasError = true;
                    });
                  }
                });
    } catch (_) {
      if (mounted) {
        setState(() {
          _hasError = true;
        });
      }
    }
  }

  void _videoStateListener() {
    if (mounted) {
      setState(() {
        _isPlaying = _controller.value.isPlaying;
      });
    }
  }

  void _togglePlayPause() {
    if (_isPlaying) {
      _controller.pause();
    } else {
      _controller.play();
    }
  }

  Future<void> _retryLoading() async {
    if (mounted) {
      setState(() {
        _hasError = false;
        _isInitialized = false;
      });
    }
    await _initializeVideoPlayer();
  }

  @override
  void dispose() {
    _controller.removeListener(_videoStateListener);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Video Player'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: _hasError
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 48),
                  const SizedBox(height: 16),
                  const Text('Failed to load video'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _retryLoading,
                    child: const Text('Retry'),
                  ),
                ],
              )
            : !_isInitialized
            ? const CircularProgressIndicator()
            : AspectRatio(
                aspectRatio: _controller.value.aspectRatio,
                child: GestureDetector(
                  onTap: _togglePlayPause,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      VideoPlayer(_controller),
                      if (!_isPlaying)
                        const Icon(
                          Icons.play_arrow,
                          size: 50,
                          color: Colors.white,
                        ),
                    ],
                  ),
                ),
              ),
      ),
    );
  }
}
