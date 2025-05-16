import 'package:chamcongspit_flutter/cores/models/global_interface.dart';
import 'package:chamcongspit_flutter/data/models/statistic/InfoStatisticResponse.dart';
import 'package:chamcongspit_flutter/data/models/statistic/SalaryInfoResponse.dart';
import 'package:chamcongspit_flutter/data/services/StatisticServices.dart';

class StatisticRespositories {
  StatisticServices statisticServices = StatisticServices();

  Future<SalaryInfoResponse> SalaryInfo() async {
    return await statisticServices.SalaryInfo();
  }

  Future<InfoStatisticResponse> InfoStatistic() async {
    return await statisticServices.InfoStatistic();
  }
}
