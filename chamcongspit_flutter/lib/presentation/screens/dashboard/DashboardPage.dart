import 'package:chamcongspit_flutter/data/models/statistic/InfoStatisticResponse.dart';
import 'package:chamcongspit_flutter/data/models/statistic/SalaryInfoResponse.dart';
import 'package:chamcongspit_flutter/data/models/student/StudentResponse.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetView.dart';
import 'package:chamcongspit_flutter/data/repositories/StatisticRespositories.dart';
import 'package:chamcongspit_flutter/data/repositories/StudentResponsitories.dart';
import 'package:chamcongspit_flutter/data/repositories/TimesheetRespositories.dart';
import 'package:chamcongspit_flutter/routers/app_router.dart';
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
  final TimesheetRespositories timesheetRespositories =
      TimesheetRespositories();
  final StudentResponsitories studentRespositories = StudentResponsitories();

  List<StudentResponse>? studentResponse;
  SalaryInfoResponse? salaryInfoResponse;
  InfoStatisticResponse? infoStatisticResponse;
  List<TimesheetView>? timesheetResponse;

  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchSalaryInfo();
    _fetchInfoStatistic();
    _fetchStudentInfo();
    _fetchTimesheet();
  }

  void _fetchStudentInfo() async {
    try {
      final response = await studentRespositories.getStudent();
      setState(() {
        studentResponse = response.data;
        _checkLoading();
      });
    } catch (e) {
      Future.delayed(const Duration(seconds: 2), _fetchStudentInfo);
    }
  }

  void _fetchTimesheet() async {
    try {
      final response = await timesheetRespositories.getTimesheet();
      setState(() {
        timesheetResponse = response.data;
        _checkLoading();
      });
    } catch (e) {
      Future.delayed(const Duration(seconds: 2), _fetchSalaryInfo);
    }
  }

  void _fetchSalaryInfo() async {
    try {
      final response = await statisticRespositories.SalaryInfo();
      setState(() {
        salaryInfoResponse = response;
        _checkLoading();
      });
    } catch (e) {
      Future.delayed(const Duration(seconds: 2), _fetchSalaryInfo);
    }
  }

  void _fetchInfoStatistic() async {
    try {
      final response = await statisticRespositories.InfoStatistic();
      setState(() {
        infoStatisticResponse = response;
        _checkLoading();
      });
    } catch (e) {
      Future.delayed(const Duration(seconds: 2), _fetchInfoStatistic);
    }
  }

  void _checkLoading() {
    if (salaryInfoResponse != null && infoStatisticResponse != null) {
      isLoading = false;
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
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // PHẦN HEADER CỐ ĐỊNH
              isLoading
                  ? buildLoadCardSalary()
                  : Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF2B7EF7), Color(0xFF32A8F3)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'SPIT HUSC | Đại học Khoa học Huế',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
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
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _ActionButton(
                              title:
                                  (infoStatisticResponse!.numberStudent ?? 0)
                                      .toString(),
                              label: "Sinh\nviên",
                            ),
                            _ActionButton(
                              title:
                                  (infoStatisticResponse!.numberTimesheet ?? 0)
                                      .toString(),
                              label: "Lượt chấm\ncông",
                            ),
                            _ActionButton(
                              title:
                                  (infoStatisticResponse!.numberStudent ?? 0)
                                      .toString(),
                              label: "Số\nlớp",
                            ),
                            _ActionButton(
                              title:
                                  (infoStatisticResponse!.numberTimesheetDay ??
                                          0)
                                      .toString(),
                              label: "Số lượt\nchấm công",
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

              const SizedBox(height: 20),

              const Text(
                "Số buổi sinh viên đã đi",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 10),
              isLoading
                  ? buildCardClassStudent()
                  : SizedBox(
                    height: 80,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount:
                          salaryInfoResponse?.salaryInfoStudents?.length ?? 0,
                      separatorBuilder: (_, __) => const SizedBox(width: 16),
                      itemBuilder: (context, index) {
                        final student =
                            salaryInfoResponse!.salaryInfoStudents![index];
                        return _SendAgainCard(
                          name: student.studentName ?? 'Không rõ',
                          amount: "Số buổi: ${student.day ?? 0}",
                          salary: student.salary ?? 0,
                          imageUrl:
                              (studentResponse != null)
                                  ? (studentResponse!
                                      .firstWhere(
                                        (element) =>
                                            element.id == student.idName,
                                        orElse: () => StudentResponse(),
                                      )
                                      .urlAvatar) // Replace 'avatar' with the correct property name if different
                                  : null,
                        );
                      },
                    ),
                  ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Danh sách chấm công gần đây",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushReplacementNamed(
                        context,
                        AppRoutes.timesheet,
                      );
                    },
                    child: const Text(
                      "Xem thêm",
                      style: TextStyle(color: Colors.blue, fontSize: 14),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // PHẦN CUỘN ĐƯỢC
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount:
                            (timesheetResponse?.length ?? 0) > 10
                                ? 10
                                : (timesheetResponse?.length ?? 0),
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final timesheet = timesheetResponse![index];
                          return _TransactionItem(
                            nameStudents:
                                timesheet.studentsName?.join(', ') ??
                                'Không rõ',
                            nameClass: timesheet.className ?? 'Không rõ',
                            date: timesheet.date ?? 'Không rõ',
                            urlImage:
                                timesheet.imageUrl ??
                                'https://via.placeholder.com/150',
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
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
  final String? imageUrl;

  const _SendAgainCard({
    required this.name,
    required this.amount,
    required this.salary,
    this.imageUrl,
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
          (imageUrl != null && imageUrl!.isNotEmpty && imageUrl != "")
              ? CircleAvatar(
                backgroundColor: Colors.grey[300],
                radius: 22,
                backgroundImage: NetworkImage(imageUrl!),
                onBackgroundImageError: (_, __) {},
              )
              : const CircleAvatar(
                backgroundColor: Colors.grey,
                radius: 22,
                child: Icon(
                  Icons.account_circle,
                  color: Colors.white,
                  size: 28,
                ),
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
  final String nameStudents;
  final String nameClass;
  final String date;
  final String urlImage;

  const _TransactionItem({
    required this.nameStudents,
    required this.nameClass,
    required this.date,
    required this.urlImage,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: SizedBox(
        width: 70,
        height: 70,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child:
              (urlImage.isNotEmpty && urlImage != "")
                  ? Image.network(urlImage, fit: BoxFit.cover)
                  : Image.asset(
                    'assets/images/error/error_404.png',
                    fit: BoxFit.cover,
                  ),
        ),
      ),
      title: Text(
        nameClass,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
      ),
      subtitle: Text(nameStudents),
      trailing: Text(date),
    );
  }
}
