import 'package:flutter/material.dart';
import 'package:step_progress_indicator/step_progress_indicator.dart';
import 'kyc_id_proof.dart';

class KycPersonalDetails extends StatelessWidget {
  const KycPersonalDetails({super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController nameController = TextEditingController();
    final TextEditingController mobileController = TextEditingController();
    final TextEditingController emailController = TextEditingController();
    final TextEditingController pincodeController = TextEditingController();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Upload KYC"),
        leading: const BackButton(),
        actions: const [CloseButton()],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4),
          child: StepProgressIndicator(
            totalSteps: 3,
            currentStep: 1,
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
                "Enter Your Details",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
            ),
            const SizedBox(height: 20),
            _buildTextField(nameController, "Name"),
            _buildTextField(mobileController, "Mobile"),
            _buildTextField(emailController, "Email"),
            _buildTextField(pincodeController, "Pincode"),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const KycIdProof()),
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
