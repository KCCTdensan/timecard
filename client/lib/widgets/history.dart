import 'package:flutter/material.dart';
import 'package:timecard/widgets/cards.dart';

class HistoryWidget extends StatelessWidget {
  const HistoryWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: <Widget>[
        FilledCard(
          child: ListTile(
            leading: const Icon(Icons.door_front_door),
            title: const Text("title"),
            trailing: IconButton(
              icon: const Icon(Icons.more_vert),
              onPressed: () {},
            ),
          ),
        ),
      ],
    );
  }
}
