using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.User
{
    public class SetRoleRequest
    {
        public long UserId { get; set; }
        public long RoleId { get; set; }
    }
}
