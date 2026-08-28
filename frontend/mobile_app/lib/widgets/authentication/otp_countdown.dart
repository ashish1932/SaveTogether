import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class OTPCountdown extends StatefulWidget {
  final int initialSeconds;
  final VoidCallback onResend;

  const OTPCountdown({
    super.key,
    this.initialSeconds = 24,
    required this.onResend,
  });

  @override
  State<OTPCountdown> createState() => _OTPCountdownState();
}

class _OTPCountdownState extends State<OTPCountdown> {
  late int _secondsRemaining;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer(widget.initialSeconds);
  }

  void _startTimer(int seconds) {
    setState(() => _secondsRemaining = seconds);
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() => _secondsRemaining--);
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_secondsRemaining > 0) {
      final String formattedTime = _secondsRemaining < 10 ? '00:0$_secondsRemaining' : '00:$_secondsRemaining';

      return Text(
        'Resend OTP in $formattedTime',
        style: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: AppColors.textSecondary,
        ),
      );
    }

    return TextButton(
      onPressed: () {
        widget.onResend();
        _startTimer(widget.initialSeconds);
      },
      child: Text(
        'Resend OTP',
        style: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: AppColors.primaryBlue,
        ),
      ),
    );
  }
}
