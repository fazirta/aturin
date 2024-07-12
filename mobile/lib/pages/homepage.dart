import 'package:area51/UI_UX/navigation.dart';
import 'package:area51/UI_UX/widget.dart';
import 'package:area51/my_controller.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:area51/services/data_controller.dart';

import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

final String userId = FirebaseAuth.instance.currentUser!.uid;

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    final controller = Get.put(MyController());
    bool _atBottom = false;

    return Scaffold(
      backgroundColor: Color.fromARGB(255, 17, 24, 37),
      body: Stack(
        children: [
          GetX<MyController>(builder: (context) {
            return controller.display.value;
          }),
          // value.display,

          /// Fader Effect
          Positioned(
              left: 0,
              right: 0,
              bottom: height - 70,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blueAccent, Colors.lightBlueAccent],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      offset: Offset(0, 10),
                      blurRadius: 20,
                    ),
                  ],
                ),
                padding: EdgeInsets.only(left: 16, top: 30, bottom: 8),
                child: Text(
                  "ATURIN",
                  style: GoogleFonts.arsenal(
                    textStyle: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
              )),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: AppFaderEffect(atBottom: _atBottom),
          ),

          /// Bottom Navigation Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: AppBBN(
              // func: (){},
              atBottom: _atBottom,
            ),
          ),
        ],
      ),
      // bottomNavigationBar: BottomNavigationBar(
      //   items: [

      //   ],
      // ),
    );
  }
}
