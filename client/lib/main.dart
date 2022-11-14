import 'package:flutter/material.dart';
import 'package:timecard/screens/home.dart';

void main() => runApp(const App());

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'timecard',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.lightBlue,
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.lightBlue,
        brightness: Brightness.dark,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomePage(),
      },
    );
  }
}
