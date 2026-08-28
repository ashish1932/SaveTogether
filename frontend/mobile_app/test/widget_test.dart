import 'package:flutter_test/flutter_test.dart';
import 'package:bulk_service_booking/main.dart';

void main() {
  testWidgets('App initializes animated splash screen test', (WidgetTester tester) async {
    await tester.pumpWidget(const SaveTogetherApp());
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('SaveTogether'), findsOneWidget);
    await tester.pumpAndSettle(const Duration(seconds: 3));
  });
}
