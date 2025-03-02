using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.Http
{
    public class ResponseArray
    {
        public static object ResponseList(object data, int totalRecords, int totalPages, int currentPage, int pageSize)
        {
            return new
            {
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                CurrentPage = currentPage,
                PageSize = pageSize,
                Data = data
            };
        }
    }
}
