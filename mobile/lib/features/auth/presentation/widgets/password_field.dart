
import 'package:flutter/material.dart';
import 'package:mobile/features/media/data/services/media_service.dart';
import 'package:mobile/features/auth/presentation/widgets/auth_form.dart';
import 'package:provider/provider.dart';
import '../../data/services/auth_service.dart';
import 'package:flutter/material.dart';


class PasswordField extends StatefulWidget {
  final TextEditingController controller;
  final String? Function(String?) validator;

  const PasswordField({
    super.key,
    required this.controller,
    required this.validator,
  });

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      obscureText: _obscureText,
      validator: widget.validator,
      decoration: InputDecoration(
        labelText: 'Password',
        hintText: 'Enter your password',
        prefixIcon: const Icon(Icons.lock_outline),
        suffixIcon: IconButton(
          icon: Icon(_obscureText ? Icons.visibility_off : Icons.visibility),
          onPressed: () => setState(() => _obscureText = !_obscureText),
        ),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
