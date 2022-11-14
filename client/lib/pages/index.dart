import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:timecard/widgets/home.dart';
import 'package:timecard/widgets/history.dart';
import 'package:timecard/widgets/stats.dart';
import 'package:timecard/widgets/person.dart';

class IndexPage extends StatefulWidget {
  const IndexPage({super.key});

  @override
  State<IndexPage> createState() => _IndexPageState();
}

class _IndexPageState extends State<IndexPage> {
  int _currentPageIndex = 0;
  final _pageController = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Image(
          image: AssetImage("assets/logo_text.png"),
          height: 40,
        ),
      ),
      // スワイプで開きたい
      drawer: Drawer(
        child: Column(
          children: <Widget>[
            const DrawerHeader(
              child: Text("へっだー"),
            ),
            Expanded(
              child: ListView(
                children: <Widget>[
                  TextButton(
                    // いい感じにする
                    child: const Text("ぼでー"),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            Container(
              margin: const EdgeInsets.only(bottom: 36),
              child: Row(
                children: <Widget>[
                  const Text("ふったー"),
                ],
              ),
            ),
          ],
        ),
      ) ,
      body: PageView(
        controller: _pageController,
        onPageChanged: (int index) {
          setState(() {
            _currentPageIndex = index;
          });
        },
        children: <Widget>[
          HomeWidget(),
          HistoryWidget(),
          StatsWidget(),
          PersonWidget(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        height: 64,
        labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
        onDestinationSelected: (int index) {
          if(index != _currentPageIndex) {
            setState(() {
              _currentPageIndex = index;
            });
            // 何らかのアニメーション
            _pageController.jumpToPage(index);
          }
        },
        selectedIndex: _currentPageIndex,
        destinations: const <Widget>[
          NavigationDestination(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.history),
            label: 'History',
          ),
          NavigationDestination(
            icon: Icon(Icons.bar_chart),
            label: 'Stats',
          ),
          NavigationDestination(
            icon: Icon(Icons.person),
            label: 'Person',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        tooltip: 'Add',
        child: const Icon(Icons.add),
      ),
    );
  }
}
