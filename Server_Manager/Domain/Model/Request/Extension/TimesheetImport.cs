using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Extension
{
    public class TimesheetImport
    {
        public List<TimesheetUpload> timesheetUploads = new List<TimesheetUpload>();
    }
    public class TimesheetUpload
    {
        public string Timestamp { get; set; }
        public string EmailAddress { get; set; }
        public string SupportGroup { get; set; }
        public string AttendanceDate { get; set; }
        public string AttendancePeriod { get; set; }
        public string Supporter1Name { get; set; }
        public string? Supporter2Name { get; set; }
        public string EvidenceImage { get; set; }
    }
}
