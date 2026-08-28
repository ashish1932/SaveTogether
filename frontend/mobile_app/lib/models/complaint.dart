class FAQItem {
  final String id;
  final String category;
  final String question;
  final String answer;

  FAQItem({
    required this.id,
    required this.category,
    required this.question,
    required this.answer,
  });
}

class ChatMessage {
  final String id;
  final String sender; // 'User' or 'SaveTogether Support'
  final String text;
  final String time;

  ChatMessage({
    required this.id,
    required this.sender,
    required this.text,
    required this.time,
  });
}

class ComplaintItem {
  final String complaintId;
  final String bookingId;
  final String category;
  final String description;
  final List<String> attachments;
  final String status; // OPEN, IN_PROGRESS, WAITING_USER, RESOLVED, CLOSED
  final String raisedDate;
  final List<ChatMessage> conversation;
  final String? resolutionSummary;

  ComplaintItem({
    required this.complaintId,
    required this.bookingId,
    required this.category,
    required this.description,
    required this.attachments,
    required this.status,
    required this.raisedDate,
    required this.conversation,
    this.resolutionSummary,
  });
}
