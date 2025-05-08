import 'dart:convert';
import 'dart:io';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetRequest.dart';
import 'package:chamcongspit_flutter/presentation/screens/timesheet/Form/timesheet_form.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class Step2Form extends StatefulWidget {
  final TimesheetRequest timesheetRequest;
  final InfoTimesheet timesheetInfo;

  const Step2Form({
    super.key,
    required this.timesheetRequest,
    required this.timesheetInfo,
  });

  @override
  State<Step2Form> createState() => _Step2FormState();
}

class _Step2FormState extends State<Step2Form> {
  String? _base64Image;

  Future<void> _pickImage() async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.gallery,
    );
    if (pickedFile != null) {
      setState(() {
        widget.timesheetInfo.imageFile = File(pickedFile.path);
        _base64Image = base64Encode(
          widget.timesheetInfo.imageFile!.readAsBytesSync(),
        );
        widget.timesheetRequest.imageBase64 = _base64Image;
      });
    }
  }

  Future<void> _takePhoto() async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.camera,
    );
    if (pickedFile != null) {
      setState(() {
        widget.timesheetInfo.imageFile = File(pickedFile.path);
        _base64Image = base64Encode(
          widget.timesheetInfo.imageFile!.readAsBytesSync(),
        );
        widget.timesheetRequest.imageBase64 = _base64Image;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Tải lên hình ảnh hoặc chụp ảnh',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            ElevatedButton.icon(
              onPressed: _pickImage,
              icon: const Icon(Icons.upload_file),
              label: const Text(
                "Chọn từ thư viện",
                style: TextStyle(color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
            ),
            const SizedBox(width: 10),
            ElevatedButton.icon(
              onPressed: _takePhoto,
              icon: const Icon(Icons.camera_alt),
              label: const Text(
                "Chụp ảnh",
                style: TextStyle(color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
            ),
          ],
        ),
        const SizedBox(height: 20),
        if (widget.timesheetInfo.imageFile != null)
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.file(
              widget.timesheetInfo.imageFile!,
              height: 300,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          )
        else
          const Text(
            "Chưa có hình ảnh nào được chọn.",
            style: TextStyle(color: Colors.grey),
          ),
      ],
    );
  }
}
