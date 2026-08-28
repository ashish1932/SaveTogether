import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/complaint.dart';

class ComplaintConversationScreen extends StatefulWidget {
  final ComplaintItem complaint;

  const ComplaintConversationScreen({
    super.key,
    required this.complaint,
  });

  @override
  State<ComplaintConversationScreen> createState() => _ComplaintConversationScreenState();
}

class _ComplaintConversationScreenState extends State<ComplaintConversationScreen> {
  late List<ChatMessage> _messages;
  final TextEditingController _msgController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _messages = List.from(widget.complaint.conversation);
  }

  @override
  void dispose() {
    _msgController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(ChatMessage(
        id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
        sender: 'User',
        text: text,
        time: 'Just now',
      ));
      _msgController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Complaint ${widget.complaint.complaintId}', style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 16, color: AppColors.deepNavy)),
            Text('Status: ${widget.complaint.status}', style: GoogleFonts.inter(fontSize: 12, color: AppColors.primaryBlue)),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Chat Messages List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(20.0),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final msg = _messages[index];
                  final isUser = msg.sender == 'User';

                  return Align(
                    alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                      decoration: BoxDecoration(
                        color: isUser ? AppColors.primaryBlue : AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(16).copyWith(
                          bottomRight: isUser ? Radius.zero : const Radius.circular(16),
                          bottomLeft: !isUser ? Radius.zero : const Radius.circular(16),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.deepNavy.withValues(alpha: 0.04),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                        children: [
                          Text(
                            msg.sender,
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: isUser ? Colors.white70 : AppColors.primaryBlue,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            msg.text,
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: isUser ? Colors.white : AppColors.deepNavy,
                              height: 1.4,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            msg.time,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              color: isUser ? Colors.white60 : AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // Message Input Bar
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                border: Border(top: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.1))),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msgController,
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy),
                      decoration: InputDecoration(
                        hintText: 'Type your message...',
                        hintStyle: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                        filled: true,
                        fillColor: AppColors.softBlueWhite,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _sendMessage,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(
                        color: AppColors.primaryBlue,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
