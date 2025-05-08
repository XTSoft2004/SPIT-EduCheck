import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/timesheet/TimesheetView.dart';
import 'package:chamcongspit_flutter/data/repositories/TimesheetRespositories.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  CalendarDataSource? _calendarDataSource;

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  void _loadAppointments() async {
    final dataSource = await _getCalendarDataSource();
    if (mounted) {
      setState(() {
        _calendarDataSource = dataSource;
      });
    }
  }

  bool isSameDate(DateTime date1, DateTime date2) {
    return date1.year == date2.year &&
        date1.month == date2.month &&
        date1.day == date2.day;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(
          child: Text(
            'Lịch chấm công',
            style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
          ),
        ),
      ),
      body:
          _calendarDataSource == null
              ? const Center(child: CircularProgressIndicator())
              : SfCalendar(
                view: CalendarView.month,
                initialSelectedDate: DateTime.now(),
                dataSource: _calendarDataSource!,
                monthViewSettings: MonthViewSettings(
                  showAgenda: true,
                  appointmentDisplayMode: MonthAppointmentDisplayMode.none,
                ),
                monthCellBuilder: (context, details) {
                  final count =
                      (_calendarDataSource!.appointments ?? [])
                          .where(
                            (appointment) =>
                                isSameDate(appointment.startTime, details.date),
                          )
                          .length;

                  return Container(
                    alignment: Alignment.topCenter,
                    padding: const EdgeInsets.only(top: 0),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: Column(
                      children: [
                        Text(
                          '${details.date.day}',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color:
                                details.date.month ==
                                        details.visibleDates[15].month
                                    ? Colors.black
                                    : Colors.grey,
                          ),
                        ),
                        const SizedBox(height: 4),
                        if (count > 0)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.blueAccent,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '$count',
                              style: const TextStyle(
                                fontSize: 10,
                                color: Colors.white,
                              ),
                            ),
                          ),
                      ],
                    ),
                  );
                },
                appointmentBuilder: (context, details) {
                  final Appointment appointment = details.appointments.first;

                  final parts = appointment.notes?.split('|') ?? [];
                  final imageUrl = parts.isNotEmpty ? parts[0] : '';
                  final subNote = parts.length > 1 ? parts[1] : '';

                  return Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.2),
                          blurRadius: 5,
                          offset: const Offset(2, 2),
                        ),
                      ],
                    ),
                    child: IntrinsicHeight(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(10),
                              bottomLeft: Radius.circular(10),
                            ),
                            child: Image.network(
                              imageUrl,
                              width: 50,
                              height: 50,
                              fit: BoxFit.cover,
                              errorBuilder:
                                  (context, error, stackTrace) => const Icon(
                                    Icons.image_not_supported,
                                    size: 50,
                                  ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.max,
                              children: [
                                Text(
                                  appointment.subject,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                  softWrap: true,
                                ),
                                Text(
                                  subNote,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[700],
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  'Thời gian: ${appointment.startTime.hour}:${appointment.startTime.minute.toString().padLeft(2, '0')} - '
                                  '${appointment.endTime.hour}:${appointment.endTime.minute.toString().padLeft(2, '0')}',
                                  style: TextStyle(
                                    fontSize: 8,
                                    fontStyle: FontStyle.italic,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
    );
  }

  Future<_AppointmentDataSource> _getCalendarDataSource() async {
    final timesheetRepository = TimesheetRespositories();
    final appointments = <Appointment>[];

    try {
      final response = await timesheetRepository.getTimesheet();
      if (response.data != null) {
        for (var timesheet in response.data!) {
          appointments.add(
            Appointment(
              startTime: DateTime.parse(
                timesheet.date ?? '',
              ).add(Duration(hours: 0)),
              endTime: DateTime.parse(
                timesheet.date ?? '',
              ).add(Duration(hours: 0)),
              subject: timesheet.className ?? '',
              color: Colors.blue,
              notes:
                  '${timesheet.imageUrl}|${timesheet.studentsName?.join(', ')}',
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error fetching timesheet data: $e');
    }

    return _AppointmentDataSource(appointments);
  }
}

class _AppointmentDataSource extends CalendarDataSource {
  _AppointmentDataSource(List<Appointment> source) {
    appointments = source;
  }
}
