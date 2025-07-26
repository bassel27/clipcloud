import 'package:flutter/material.dart';
import 'package:mobile/features/media/data/services/media_service.dart';
import 'package:mobile/features/auth/presentation/widgets/auth_form.dart';
import 'package:mobile/features/auth/presentation/widgets/auth_header.dart';
import 'package:provider/provider.dart';
import '../../data/services/auth_service.dart';
import '../../../media/presentation/screens/media_screen.dart';
import 'package:flutter/material.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isLogin = true;
  bool _isLoading = false;
  String? _error;

  void _toggleAuthMode() {
    setState(() {
      _isLogin = !_isLogin;
      _error = null;
    });
  }

  Future<void> _handleAuthSuccess() async {
    final mediaService = Provider.of<MediaService>(context, listen: false);
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => MediaPage(mediaService: mediaService),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            children: [
              const SizedBox(height: 40),
              AuthHeader(isLogin: _isLogin),
              const SizedBox(height: 40),
              AuthForm(
                isLogin: _isLogin,
                isLoading: _isLoading,
                error: _error,
                onToggleAuthMode: _toggleAuthMode,
                onAuthSuccess: _handleAuthSuccess,
                onError: (error) => setState(() => _error = error),
                onLoading: (isLoading) =>
                    setState(() => _isLoading = isLoading),
              ),
              if (_isLogin) ...[
                const SizedBox(height: 16),
                Center(
                  child: TextButton(
                    onPressed: () {
                      // Add forgot password functionality
                    },
                    child: Text(
                      'Forgot password?',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
