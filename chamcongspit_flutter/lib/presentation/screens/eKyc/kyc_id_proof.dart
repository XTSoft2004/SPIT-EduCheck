import 'package:flutter/material.dart';
import 'package:step_progress_indicator/step_progress_indicator.dart';
import 'kyc_bank_details.dart';

class KycIdProof extends StatelessWidget {
  const KycIdProof({super.key});

  @override
  Widget build(BuildContext context) {
    String selectedDoc = 'Aadhar Card';

    return Scaffold(
      appBar: AppBar(
        title: const Text("Upload KYC"),
        leading: const BackButton(),
        actions: const [CloseButton()],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4),
          child: StepProgressIndicator(
            totalSteps: 3,
            currentStep: 2,
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Choose Document Type",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              children: [
                _buildChoiceChip(context, 'Aadhar Card', selectedDoc),
                _buildChoiceChip(context, 'Pan Card', selectedDoc),
                _buildChoiceChip(context, 'Driving License', selectedDoc),
              ],
            ),
            const SizedBox(height: 30),
            const Text(
              "Upload ID Proof",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 10),
            Center(
              child: IconButton(
                iconSize: 60,
                onPressed: () {},
                icon: const Icon(
                  Icons.camera_alt_outlined,
                  color: Colors.green,
                ),
              ),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const KycBankDetails()),
                );
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text("Next"),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChoiceChip(BuildContext context, String label, String selected) {
    final isSelected = selected == label;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: Colors.green,
      onSelected: (_) {},
    );
  }
}
