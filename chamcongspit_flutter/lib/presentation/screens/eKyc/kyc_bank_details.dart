import 'package:flutter/material.dart';
import 'package:step_progress_indicator/step_progress_indicator.dart';

class KycBankDetails extends StatelessWidget {
  const KycBankDetails({super.key});

  @override
  Widget build(BuildContext context) {
    final accountController = TextEditingController();
    final ifscController = TextEditingController();
    final confirmController = TextEditingController();
    final nameController = TextEditingController(text: "Ankit Mahajan");

    return Scaffold(
      appBar: AppBar(
        title: const Text("Upload KYC"),
        leading: const BackButton(),
        actions: const [CloseButton()],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4),
          child: StepProgressIndicator(
            totalSteps: 3,
            currentStep: 3,
            size: 4,
            padding: 0,
            selectedColor: Colors.green,
            unselectedColor: Colors.grey.shade300,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                "Enter Account Details",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                _buildAccountType("Savings", true),
                const SizedBox(width: 10),
                _buildAccountType("Current", false),
              ],
            ),
            const SizedBox(height: 20),
            _buildTextField(nameController, "Name on Account"),
            _buildTextField(accountController, "Account Number"),
            _buildTextField(confirmController, "Confirm Account Number"),
            _buildTextField(ifscController, "IFSC Code"),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                Navigator.popUntil(context, (route) => route.isFirst);
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text("Submit"),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountType(String label, bool isSelected) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? Colors.green : Colors.grey.shade100,
          borderRadius: BorderRadius.circular(10),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: TextStyle(color: isSelected ? Colors.white : Colors.black),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: Colors.grey.shade100,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}
