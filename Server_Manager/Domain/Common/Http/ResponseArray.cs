using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using static Domain.Common.Http.ResponseArray;

namespace Domain.Common.Http
{
    public class ResponseArray
    {
        public class ResponseArrayModel()
        {
            public int? TotalRecords { get; set; }
            public int? TotalPages { get; set; }
            public int? CurrentPage { get; set; }
            public int? PageSize { get; set; }
            public object Data { get; set; }
        }
        public static object ResponseList(object data, int totalRecords, int totalPages, int currentPage, int pageSize)
        {
            return new ResponseArrayModel()
            {
                TotalRecords = totalRecords,
                TotalPages = totalPages < 0 ? null : totalPages,
                CurrentPage = currentPage < 0 ? null : currentPage,
                PageSize = pageSize < 0 ? null : pageSize,
                Data = data
            };
        }
    }
}