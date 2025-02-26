using Domain.Model.Request.Student;
using Domain.Model.Response.Student;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.ViewModel
{
    public class StudentViewModel
    {
        public StudentRequest studentRequest { get; set; }
        public List<StudentResponse> studentResponses { get; set; }
    }
}
