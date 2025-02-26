using Domain.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Auth
{
    public class AuthToken
    {
        public long Id { get; set; }
        public string? Username { get; set; }
        public string? RoleName { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
