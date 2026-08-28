enum AppEnvironment {
  development,
  staging,
  production,
}

class EnvironmentConfig {
  final AppEnvironment environment;
  final String apiBaseUrl;
  final String appTitle;
  final String razorpayKeyId;
  final bool enableDebugLogging;

  const EnvironmentConfig({
    required this.environment,
    required this.apiBaseUrl,
    required this.appTitle,
    required this.razorpayKeyId,
    required this.enableDebugLogging,
  });

  static const EnvironmentConfig development = EnvironmentConfig(
    environment: AppEnvironment.development,
    apiBaseUrl: 'http://10.0.2.2:5000/api/v1', // Android emulator localhost alias
    appTitle: 'SaveTogether (Dev)',
    razorpayKeyId: 'rzp_test_mockkeyid',
    enableDebugLogging: true,
  );

  static const EnvironmentConfig staging = EnvironmentConfig(
    environment: AppEnvironment.staging,
    apiBaseUrl: 'https://api-staging.savetogether.in/api/v1',
    appTitle: 'SaveTogether (Staging)',
    razorpayKeyId: 'rzp_test_stagingkeyid',
    enableDebugLogging: true,
  );

  static const EnvironmentConfig production = EnvironmentConfig(
    environment: AppEnvironment.production,
    apiBaseUrl: 'https://api.savetogether.in/api/v1',
    appTitle: 'SaveTogether',
    razorpayKeyId: 'rzp_live_PRODKEYID12345',
    enableDebugLogging: false,
  );

  static EnvironmentConfig current = development;

  static void setEnvironment(AppEnvironment env) {
    switch (env) {
      case AppEnvironment.development:
        current = development;
        break;
      case AppEnvironment.staging:
        current = staging;
        break;
      case AppEnvironment.production:
        current = production;
        break;
    }
  }
}
