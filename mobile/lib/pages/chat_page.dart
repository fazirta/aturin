import 'package:area51/services/product_category.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

final apiKey = "AIzaSyBatUW7pEBpkEEa5Kqgw5GZUgzg0s01lcU";

class ChatPage extends StatefulWidget {
  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  List<Widget> chats = [];

  final geminiModel = GenerativeModel(
      model: 'gemini-1.5-flash-latest',
      apiKey: apiKey,
      safetySettings: [
        SafetySetting(HarmCategory.harassment, HarmBlockThreshold.high),
        SafetySetting(HarmCategory.hateSpeech, HarmBlockThreshold.high),
      ]);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    double height = size.height;
    double width = size.width;
    return Column(
      children: [
        SizedBox(height: 30),
        Container(
          color: Color.fromARGB(255, 17, 24, 37),
          height: height - 120,
          width: double.infinity,
          child: ListView(children: chats),
        ),
        _typingBox(),
      ],
    );
  }

  Widget _typingBox() {
    Size size = MediaQuery.of(context).size;
    double height = size.height;
    double width = size.width;
    TextEditingController chatController = TextEditingController();
    return Container(
      padding: EdgeInsets.only(top: 8, bottom: 8),
      decoration: BoxDecoration(
        // borderRadius: BorderRadius.only(topLeft: Radius.circular(10), topRight:  Radius.circular(10)),
        color: Color.fromARGB(255, 58, 67, 82),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            margin: EdgeInsets.only(left: 10),
            width: width - 60,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              // border: Border.all(width: 5, color: const Color.fromARGB(255, 16, 21, 24)),
            ),
            child: TextField(
              controller: chatController,
              minLines: 1,
              maxLines: 4,
              decoration: InputDecoration(
                border: InputBorder.none,
                contentPadding:
                    EdgeInsets.symmetric(horizontal: 15, vertical: 10),
              ),
            ),
          ),
          IconButton(
              onPressed: () {
                _handleSendMessage(chatController.text);
                chatController.clear();
              },
              icon: Icon(Icons.send))
        ],
      ),
    );
  }

  static Widget chatFromMe(String text) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Container(
          constraints: BoxConstraints(maxWidth: 300),
          margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
          padding: EdgeInsets.symmetric(vertical: 10, horizontal: 15),
          decoration: BoxDecoration(
            color: Colors.blue,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            text,
            style: TextStyle(color: Colors.white),
          ),
        ),
      ],
    );
  }

  static Widget chatFromOps(String text) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Container(
          constraints: BoxConstraints(maxWidth: 300),
          margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
          padding: EdgeInsets.symmetric(vertical: 10, horizontal: 15),
          decoration: BoxDecoration(
            color: Colors.grey,
            borderRadius: BorderRadius.circular(10),
          ),
          child: MarkdownBody(
            data: text,
            styleSheet: MarkdownStyleSheet(
              p: TextStyle(color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  void _handleSendMessage(String text) async {
    if (text.trim() != "") {
      setState(() {
        chats.add(chatFromMe(text.trim()));
      });
      final response = await _getResponse(text);
      setState(() {
        chats.add(chatFromOps(response));
      });
    }
  }

  Future<String> _getResponse(String text) async {
    final prompt =
        '''Kamu adalah bot konsultan finansial bernama Finny, Saya adalah seorang pengusaha menjalankan usaha UMKM
      Tolong jawab chat saya berikutnya berdasarkan data:
      incomes: ${Income.jsonStringify()} 
      expenses: ${Expense.jsonStringify()}
      products: ${Product.jsonStringify()}
      pertanyaan: $text''';
    final response = await geminiModel.generateContent([Content.text(prompt)]);
    return response.text!;
  }
}
