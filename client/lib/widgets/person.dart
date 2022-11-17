import 'package:flutter/material.dart';
import 'package:timecard/widgets/cards.dart';

class PersonWidget extends StatelessWidget {
  const PersonWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        OutlinedCard(
          child: const SizedBox(
            height: 100,
            child: Center(
              child: ListTile(
                leading: Icon(Icons.person, size: 56),
                title: Text("asdf"),
                trailing: Icon(Icons.edit),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
