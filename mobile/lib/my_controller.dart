import 'package:area51/pages/category_page.dart';
import 'package:area51/pages/profile_page.dart';
import 'package:area51/pages/in_ex_page.dart';
import 'package:area51/pages/chat_page.dart';
import 'package:area51/pages/dashboard_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MyController extends GetxController {
  final List<Widget> pages = [
    ProfilePage(),
    ChatPage(),
    InExPage(),
    CategoryPage(),
    DashboardPage()
  ];
  Rx<Widget> display = (DashboardPage() as Widget).obs;

  void setDisplay(int index){
    display.value = (pages[index]) as Widget;
  }
}
