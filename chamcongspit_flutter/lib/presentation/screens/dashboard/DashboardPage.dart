import 'package:chamcongspit_flutter/data/models/statistic/InfoStatisticResponse.dart';
import 'package:chamcongspit_flutter/data/models/statistic/SalaryInfoResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/StatisticRespositories.dart';
import 'package:flutter/material.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  StatisticRespositories statisticRespositories = StatisticRespositories();
  SalaryInfoResponse? salaryInfoResponse;
  List<InfoStatisticResponse>? infoStatisticResponse;
  @override
  void initState() {
    super.initState();
    loadSalaryInfo();
  }

  void loadSalaryInfo() async {
    final response = await statisticRespositories.SalaryInfo();
    if (response != null) {
      setState(() {
        salaryInfoResponse = response;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Balance Header
        Container(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF2B7EF7), Color(0xFF32A8F3)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text(
                    'SPIT HUSC | Đại học Khoa học Huế',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Text(
                'Tổng lương của sinh viên',
                style: TextStyle(color: Colors.white70, fontSize: 14),
              ),
              const SizedBox(height: 10),
              Text(
                salaryInfoResponse?.toltalSalary != null
                    ? "${salaryInfoResponse!.toltalSalary!.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')} VNĐ"
                    : '',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _ActionButton(icon: Icons.send, label: "Send\nMoney"),
                  _ActionButton(
                    icon: Icons.compare_arrows,
                    label: "Card to Card\nTransfer",
                  ),
                  _ActionButton(
                    icon: Icons.schedule,
                    label: "Manage\nSchedule",
                  ),
                  _ActionButton(icon: Icons.smartphone, label: "Mobile\nTopup"),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Send Again
        const Text(
          "Send Again",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 10),
        Row(
          children: const [
            _SendAgainCard(name: "Jack Hann", amount: "\$4,500"),
            SizedBox(width: 10),
            _SendAgainCard(name: "Jack Smith", amount: "\$4,500"),
          ],
        ),
        const SizedBox(height: 20),

        // Recent Transactions
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: const [
            Text(
              "Recent Transaction",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text("See More", style: TextStyle(color: Colors.blue)),
          ],
        ),
        const SizedBox(height: 10),
        const _TransactionItem(
          name: "John Danny",
          date: "12 Jul . Amount Debited",
          amount: "- \$16,984",
        ),
        const _TransactionItem(
          name: "Mark Daniel",
          date: "17 Jul . Payment Received",
          amount: "\$38.02",
        ),
        const _TransactionItem(
          name: "Peterson",
          date: "17 Jul . Amount Debited",
          amount: "- \$4,276.02",
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;

  const _ActionButton({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CircleAvatar(
          backgroundColor: Colors.white24,
          radius: 25,
          child: Icon(icon, color: Colors.white),
        ),
        const SizedBox(height: 5),
        Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.white, fontSize: 12),
        ),
      ],
    );
  }
}

class _SendAgainCard extends StatelessWidget {
  final String name;
  final String amount;

  const _SendAgainCard({required this.name, required this.amount});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Color(0xFFF5F5F5),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            const CircleAvatar(
              backgroundColor: Colors.grey,
              radius: 18,
              child: Icon(Icons.account_circle, color: Colors.white),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                Text(amount, style: const TextStyle(color: Colors.grey)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _TransactionItem extends StatelessWidget {
  final String name;
  final String date;
  final String amount;

  const _TransactionItem({
    required this.name,
    required this.date,
    required this.amount,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: const CircleAvatar(
        backgroundColor: Colors.grey,
        child: Icon(Icons.account_circle, color: Colors.white),
      ),
      title: Text(name),
      subtitle: Text(date),
      trailing: Text(
        amount,
        style: TextStyle(
          color: amount.contains('-') ? Colors.red : Colors.green,
        ),
      ),
    );
  }
}
