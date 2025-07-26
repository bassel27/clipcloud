import 'package:flutter/material.dart';
import 'package:mobile/features/media/data/services/media_service.dart';
import 'package:mobile/features/auth/presentation/widgets/auth_form.dart';
import 'package:mobile/features/auth/presentation/widgets/auth_form_error_banner.dart';
import 'package:mobile/features/auth/presentation/widgets/password_field.dart';
import 'package:provider/provider.dart';
import '../../data/services/auth_service.dart';
import 'package:flutter/material.dart';


class AuthForm extends StatefulWidget {
  final bool isLogin;
  final bool isLoading;
  final String? error;
  final VoidCallback onToggleAuthMode;
  final VoidCallback onAuthSuccess;
  final Function(String) onError;
  final Function(bool) onLoading;

  const AuthForm({
    super.key,
    required this.isLogin,
    required this.isLoading,
    required this.error,
    required this.onToggleAuthMode,
    required this.onAuthSuccess,
    required this.onError,
    required this.onLoading,
  });

  @override
  State<AuthForm> createState() => _AuthFormState();
}

class _AuthFormState extends State<AuthForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    widget.onLoading(true);
    widget.onError('');

    try {
      final auth = Provider.of<AuthService>(context, listen: false);
      if (widget.isLogin) {
        await auth.signIn(_emailController.text, _passwordController.text);
      } else {
        await auth.signUp(_emailController.text, _passwordController.text);
      }
      widget.onAuthSuccess();
    } catch (e) {
      widget.onError(e.toString().replaceAll('Exception: ', ''));
    } finally {
      widget.onLoading(false);
    }
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) return 'Please enter your email';
    if (!value.contains('@')) return 'Please enter a valid email';
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) return 'Please enter your password';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _emailController,
            validator: _validateEmail,
            decoration: InputDecoration(
              labelText: 'Email',
              hintText: 'Enter your email',
              prefixIcon: const Icon(Icons.email_outlined),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 20),
          PasswordField(
            controller: _passwordController,
            validator: _validatePassword,
          ),
          const SizedBox(height: 16),
          AuthFormErrorBanner(error: widget.error),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              onPressed: widget.isLoading ? null : _submit,
              child: widget.isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation(Colors.white),
                      ),
                    )
                  : Text(
                      widget.isLogin ? 'Login' : 'Sign Up',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 24),
          Center(
            child: TextButton(
              onPressed: widget.onToggleAuthMode,
              child: RichText(
                text: TextSpan(
                  text: widget.isLogin
                      ? "Don't have an account? "
                      : "Already have an account? ",
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                  children: [
                    TextSpan(
                      text: widget.isLogin ? 'Sign Up' : 'Login',
                      style: TextStyle(
                        color: theme.colorScheme.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}


