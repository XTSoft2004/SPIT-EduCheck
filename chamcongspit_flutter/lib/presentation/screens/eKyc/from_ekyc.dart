import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KYC Upload',
      theme: ThemeData(primarySwatch: Colors.green),
      home: KYCPage(),
    );
  }
}

class KYCPage extends StatefulWidget {
  @override
  _KYCPageState createState() => _KYCPageState();
}

class _KYCPageState extends State<KYCPage> {
  int _currentStep = 0;

  void nextStep() {
    if (_currentStep < 2) {
      setState(() {
        _currentStep++;
      });
    }
  }

  void previousStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  Widget _buildProgressIndicator() {
    List<String> steps = ['Personal Details', 'ID Proof', 'Bank Details'];

    return Row(
      children: List.generate(steps.length, (index) {
        final isActive = index == _currentStep;
        final isCompleted = index < _currentStep;

        return Expanded(
          child: Column(
            children: [
              Text(
                steps[index],
                style: TextStyle(
                  color:
                      isActive
                          ? Colors.green
                          : isCompleted
                          ? Colors.black
                          : Colors.grey,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                ),
              ),
              SizedBox(height: 5),
              AnimatedContainer(
                duration: Duration(milliseconds: 400),
                height: 4,
                margin: EdgeInsets.symmetric(horizontal: 4), // Add spacing
                decoration: BoxDecoration(
                  color:
                      isActive || isCompleted ? Colors.green : Colors.grey[300],
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildStepContent() {
    Widget content;
    switch (_currentStep) {
      case 0:
        content = _buildPersonalDetails();
        break;
      case 1:
        content = _buildIDProof();
        break;
      case 2:
        content = _buildBankDetails();
        break;
      default:
        content = Container();
    }

    return AnimatedSwitcher(
      duration: Duration(milliseconds: 500),
      transitionBuilder:
          (child, animation) => ScaleTransition(
            scale: CurvedAnimation(parent: animation, curve: Curves.easeInOut),
            child: FadeTransition(opacity: animation, child: child),
          ),
      child: content,
    );
  }

  Widget _buildPersonalDetails() {
    return Column(
      key: ValueKey(0),
      children: [
        _buildTextField('Name', 'Ankit Mahajan'),
        _buildTextField('Mobile', '9899999999'),
        _buildTextField('Email', 'mn.ankit@yahoo.in'),
        _buildTextField('Pincode', '122003'),
        _buildNextButton(),
      ],
    );
  }

  Widget _buildIDProof() {
    return Column(
      key: ValueKey(1),
      children: [
        Text(
          'Choose Document Type',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 10),
        Wrap(
          spacing: 10,
          children: [
            _buildChip('Aadhar Card'),
            _buildChip('Pan Card'),
            _buildChip('Driving License'),
          ],
        ),
        SizedBox(height: 20),
        Icon(Icons.camera_alt, size: 50, color: Colors.green),
        Text('Upload ID Proof'),
        SizedBox(height: 10),
        _buildBackButton(),
        _buildNextButton(),
      ],
    );
  }

  Widget _buildBankDetails() {
    return Column(
      key: ValueKey(2),
      children: [
        Row(
          children: [
            _buildChip('Savings', selected: true),
            SizedBox(width: 10),
            _buildChip('Current'),
          ],
        ),
        SizedBox(height: 10),
        _buildTextField('Name on Account', 'Ankit Mahajan'),
        _buildTextField('Account Number', '66666666'),
        _buildTextField('Confirm Account Number', '66666666'),
        _buildTextField('IFSC Code', 'ABC12300'),
        _buildBackButton(),
        _buildSubmitButton(),
      ],
    );
  }

  Widget _buildTextField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextField(
        controller: TextEditingController(text: value),
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
          filled: true,
          fillColor: Colors.grey[100],
        ),
      ),
    );
  }

  Widget _buildChip(String label, {bool selected = false}) {
    return ChoiceChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) {},
      selectedColor: Colors.green[100],
    );
  }

  Widget _buildNextButton() {
    return ElevatedButton(
      onPressed: nextStep,
      child: Text('Next'),
      style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
    );
  }

  Widget _buildBackButton() {
    return TextButton(onPressed: previousStep, child: Text('Back'));
  }

  Widget _buildSubmitButton() {
    return ElevatedButton(
      onPressed: () {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('KYC Submitted!')));
      },
      child: Text('Submit'),
      style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Upload KYC'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildProgressIndicator(),
            SizedBox(height: 20),
            Expanded(child: SingleChildScrollView(child: _buildStepContent())),
          ],
        ),
      ),
    );
  }
}
