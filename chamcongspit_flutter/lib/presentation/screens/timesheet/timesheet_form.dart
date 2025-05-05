import 'package:chamcongspit_flutter/widgets/step_form_item.dart';
import 'package:flutter/material.dart';

class TimesheetFormScreen extends StatefulWidget {
  const TimesheetFormScreen({super.key});

  @override
  State<TimesheetFormScreen> createState() => _TimesheetFormScreenState();
}

class _TimesheetFormScreenState extends State<TimesheetFormScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  String _gender = 'Nam';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  void _nextStep() {
    if (_tabController.index < 2) {
      _tabController.animateTo(_tabController.index + 1);
    } else {
      showDialog(
        context: context,
        builder:
            (context) => AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              title: const Text(
                "🎉 Thông tin bạn đã nhập",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("👤 Họ tên: ${_nameController.text}"),
                  Text("📧 Email: ${_emailController.text}"),
                  Text("🚻 Giới tính: $_gender"),
                ],
              ),
              actions: [
                TextButton(
                  child: const Text('👌 Đóng'),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
      );
    }
  }

  List<Tab> _buildTabs() => [
    const Tab(icon: Icon(Icons.person), text: 'Tên'),
    const Tab(icon: Icon(Icons.email), text: 'Email'),
    const Tab(icon: Icon(Icons.wc), text: 'Giới tính'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('📝 Đăng ký thông tin'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              tabs: _buildTabs(),
              indicatorColor: Colors.indigo,
              labelColor: Colors.indigo,
              unselectedLabelColor: Colors.grey,
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                StepForm(
                  label: 'Nhập họ tên',
                  icon: Icons.person,
                  child: TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Họ tên',
                      prefixIcon: Icon(Icons.person),
                    ),
                  ),
                ),
                StepForm(
                  label: 'Nhập email',
                  icon: Icons.email,
                  child: TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      prefixIcon: Icon(Icons.email),
                    ),
                  ),
                ),
                StepForm(
                  label: 'Chọn giới tính',
                  icon: Icons.wc,
                  child: DropdownButtonFormField<String>(
                    value: _gender,
                    decoration: const InputDecoration(
                      labelText: 'Giới tính',
                      prefixIcon: Icon(Icons.wc),
                    ),
                    items:
                        ['Nam', 'Nữ', 'Khác']
                            .map(
                              (value) => DropdownMenuItem(
                                value: value,
                                child: Text(value),
                              ),
                            )
                            .toList(),
                    onChanged: (value) {
                      setState(() {
                        _gender = value!;
                      });
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        margin: const EdgeInsets.all(16),
        height: 55,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15),
            ),
            backgroundColor: Colors.indigo,
            elevation: 6,
          ),
          onPressed: _nextStep,
          child: Text(
            _tabController.index == 2 ? '✅ Hoàn thành' : '➡ Tiếp theo',
            style: const TextStyle(fontSize: 18, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
