import 'package:flutter/material.dart';
import '../models/user_profile.dart';
import '../models/society.dart';

enum AuthStep {
  splash,
  onboarding,
  login,
  otp,
  profileSetup,
  societySelection,
  addAddress,
  authenticated,
}

class AuthProvider with ChangeNotifier {
  AuthStep _currentStep = AuthStep.splash;
  bool _isLoading = false;
  String? _phoneNumber;
  String? _authError;
  UserProfile? _userProfile;

  AuthStep get currentStep => _currentStep;
  bool get isLoading => _isLoading;
  String? get phoneNumber => _phoneNumber;
  String? get authError => _authError;
  UserProfile? get userProfile => _userProfile;
  bool get isAuthenticated => _userProfile != null;

  // Mock list of societies
  final List<Society> mockSocieties = [
    Society(
      id: 'soc_01',
      name: 'ABC Residency & Apartments',
      address: 'Outer Ring Road, HSR Layout',
      city: 'Bengaluru',
      postalCode: '560102',
      totalFlats: 450,
      activeUsersCount: 148,
    ),
    Society(
      id: 'soc_02',
      name: 'Prestige Lakeside Habitat',
      address: 'Varthur Main Road, Whitefield',
      city: 'Bengaluru',
      postalCode: '560087',
      totalFlats: 600,
      activeUsersCount: 220,
    ),
    Society(
      id: 'soc_03',
      name: 'Sobha Royal Pavilion',
      address: 'Sarjapur Road',
      city: 'Bengaluru',
      postalCode: '560035',
      totalFlats: 300,
      activeUsersCount: 95,
    ),
  ];

  AuthProvider() {
    _initSession();
  }

  Future<void> _initSession() async {
    _isLoading = true;
    notifyListeners();

    // Simulate splash check (1.5 seconds)
    await Future.delayed(const Duration(milliseconds: 1500));

    _isLoading = false;
    _currentStep = AuthStep.onboarding; // Default to onboarding for first launch
    notifyListeners();
  }

  void setStep(AuthStep step) {
    _currentStep = step;
    _authError = null;
    notifyListeners();
  }

  // 1. Send OTP
  Future<bool> sendOtp(String phone) async {
    _authError = null;
    if (phone.length < 10) {
      _authError = 'Please enter a valid 10-digit mobile number.';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 800));

    _phoneNumber = phone;
    _isLoading = false;
    _currentStep = AuthStep.otp;
    notifyListeners();
    return true;
  }

  // 2. Verify OTP
  Future<bool> verifyOtp(String otp) async {
    _authError = null;
    if (otp.length != 6) {
      _authError = 'Please enter a valid 6-digit OTP code.';
      notifyListeners();
      return false;
    }

    if (otp != '123456' && otp != '000000') {
      _authError = 'Incorrect OTP. Please check the code and try again.';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 800));
    _isLoading = false;

    // Check if new user or existing user
    if (_userProfile == null) {
      _currentStep = AuthStep.profileSetup;
    } else if (_userProfile!.selectedSociety == null) {
      _currentStep = AuthStep.societySelection;
    } else {
      _currentStep = AuthStep.authenticated;
    }

    notifyListeners();
    return true;
  }

  // 3. Save Profile
  Future<bool> saveProfile({required String name, String? email}) async {
    _authError = null;
    if (name.trim().isEmpty) {
      _authError = 'Please enter your name.';
      notifyListeners();
      return false;
    }

    if (name.trim().length < 2) {
      _authError = 'Please enter a valid name.';
      notifyListeners();
      return false;
    }

    if (email != null && email.isNotEmpty && !email.contains('@')) {
      _authError = 'Please enter a valid email address.';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 600));

    _userProfile = UserProfile(
      id: 'usr_${DateTime.now().millisecondsSinceEpoch}',
      name: name.trim(),
      phone: _phoneNumber ?? '+91 98765 43210',
      email: email?.trim() ?? '',
      flatNo: 'Tower B - Flat 402',
      referralCode: 'NEIGHBOR50',
      walletBalance: 250.0,
      totalReferralsCount: 2,
    );

    _isLoading = false;
    _currentStep = AuthStep.societySelection;
    notifyListeners();
    return true;
  }

  // 4. Update Society & Flat Address
  void updateSociety(Society society, String flatNo) {
    if (_userProfile != null) {
      _userProfile = _userProfile!.copyWith(
        selectedSociety: society,
        flatNo: flatNo,
      );
    } else {
      _userProfile = UserProfile(
        id: 'usr_demo',
        name: 'Ashish Kumar',
        phone: _phoneNumber ?? '+91 98765 43210',
        email: 'ashish@example.com',
        selectedSociety: society,
        flatNo: flatNo,
        referralCode: 'NEIGHBOR50',
        walletBalance: 250.0,
        totalReferralsCount: 2,
      );
    }
    _currentStep = AuthStep.authenticated;
    notifyListeners();
  }

  void updateProfile(String name, String email) {
    if (_userProfile != null) {
      _userProfile = _userProfile!.copyWith(
        name: name,
        email: email,
      );
    } else {
      _userProfile = UserProfile(
        id: 'usr_demo',
        name: name,
        phone: _phoneNumber ?? '+91 98765 43210',
        email: email,
        flatNo: 'Tower B - Flat 402',
        referralCode: 'NEIGHBOR50',
        walletBalance: 250.0,
        totalReferralsCount: 2,
      );
    }
    notifyListeners();
  }

  void logout() {
    _userProfile = null;
    _phoneNumber = null;
    _currentStep = AuthStep.login;
    notifyListeners();
  }
}
