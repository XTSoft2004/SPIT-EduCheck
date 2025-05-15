import 'package:chamcongspit_flutter/data/models/statistic/InfoStatisticResponse.dart';
import 'package:chamcongspit_flutter/data/models/statistic/SalaryInfoResponse.dart';
import 'package:chamcongspit_flutter/data/repositories/StatisticRespositories.dart';
import 'package:flutter/material.dart';
import 'package:skeleton_loader/skeleton_loader.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final StatisticRespositories statisticRespositories =
      StatisticRespositories();
  SalaryInfoResponse? salaryInfoResponse;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchSalaryInfo();
  }

  void _fetchSalaryInfo() async {
    try {
      final response = await statisticRespositories.SalaryInfo();
      setState(() {
        salaryInfoResponse = response;
        isLoading = salaryInfoResponse?.salaryInfoStudents == null;
      });
    } catch (e) {
      Future.delayed(const Duration(seconds: 2), _fetchSalaryInfo);
    }
  }

  Widget buildLoadCardSalary() {
    return SkeletonLoader(
      builder: Container(
        height: 180,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(20),
        ),
      ),
      items: 1,
      period: const Duration(seconds: 2),
      highlightColor: Colors.grey[100]!,
      direction: SkeletonDirection.ltr,
    );
  }

  Widget buildCardClassStudent() {
    return SizedBox(
      height: 70,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: 10,
        separatorBuilder: (context, index) => const SizedBox(width: 10),
        itemBuilder:
            (context, index) => SizedBox(
              width: 150,
              child: SkeletonLoader(
                builder: Container(
                  width: double.infinity,
                  height: 70,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                items: 1,
                period: const Duration(seconds: 2),
                highlightColor: Colors.grey[100]!,
                direction: SkeletonDirection.ltr,
              ),
            ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            isLoading
                ? buildLoadCardSalary()
                : Container(
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
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
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
                        "${(salaryInfoResponse?.toltalSalary ?? 0).toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')} VNĐ",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: const [
                          _ActionButton(title: "10", label: "Sinh\nviên"),
                          _ActionButton(
                            title: "10",
                            label: "Số lượt\nchấm công",
                          ),
                          _ActionButton(title: "10", label: "Số\nlớp"),
                          _ActionButton(
                            title: "10",
                            label: "Sinh viên đi\nnhiều nhất",
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
            const SizedBox(height: 20),
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                "Số buổi sinh viên đã đi",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
            const SizedBox(height: 10),
            isLoading
                ? buildCardClassStudent()
                : SizedBox(
                  height: 70,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount:
                        salaryInfoResponse?.salaryInfoStudents?.length ?? 0,
                    separatorBuilder:
                        (context, index) => const SizedBox(width: 30),
                    itemBuilder: (context, index) {
                      final student =
                          salaryInfoResponse!.salaryInfoStudents![index];
                      return _SendAgainCard(
                        name: student.studentName ?? 'Không có tên',
                        amount: "Số buổi: ${student.day ?? 0}",
                        salary: student.salary ?? 0,
                      );
                    },
                  ),
                ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text(
                  "Danh sách chấm công gần đây",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text("Xem thêm", style: TextStyle(color: Colors.blue)),
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
        ),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final String title;
  final String label;

  const _ActionButton({required this.title, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: Colors.white24,
            borderRadius: BorderRadius.circular(15),
          ),
          alignment: Alignment.center,
          child: Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
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
  final int salary;

  const _SendAgainCard({
    required this.name,
    required this.amount,
    required this.salary,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 220,
      padding: const EdgeInsets.all(5),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F5F5),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const CircleAvatar(
            backgroundColor: Colors.grey,
            radius: 22,
            child: Icon(Icons.account_circle, color: Colors.white, size: 28),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  amount,
                  style: const TextStyle(color: Colors.grey, fontSize: 13),
                ),
                Text(
                  'Lương: ${salary.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')} VNĐ',
                  style: const TextStyle(color: Colors.grey, fontSize: 11),
                ),
              ],
            ),
          ),
        ],
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
