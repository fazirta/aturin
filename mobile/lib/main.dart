import 'package:area51/UI_UX/app_theme.dart';
import 'package:area51/my_model.dart';
import 'package:area51/services/auth.dart';
import 'package:area51/firebase_options.dart';
import 'package:area51/services/user_database.dart';
import 'package:area51/signin/signin_page.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)
      .then((value) => Get.put(AuthenticationRepository()));
  Get.put(UserDatabase());
  runApp(
    ChangeNotifierProvider(
      create: (context) => MyModel(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const SignInPage(),
    );
  }
}
