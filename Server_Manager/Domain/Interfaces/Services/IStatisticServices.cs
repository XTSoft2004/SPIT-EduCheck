using Domain.Model.Response.Statistic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IStatisticServices
    {
        StatisticStudentTimesheet GetStatisticInfo();
        List<StatisticClass>? GetStatisticClass();
        StatisticClassSalary GetStatisticInfoSalary();
    }
}
