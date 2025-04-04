using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Semester;
using Domain.Model.Response.Semester;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class SemesterServices : BaseService, ISemesterServices
    {
        private readonly IRepositoryBase<Semester> _repository;

        public SemesterServices(IRepositoryBase<Semester> repository)
        {
            _repository = repository;
        }

        public async Task<HttpResponse> CreateAsync(SemesterRequest request)
        {
            if (request == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _semester = _repository.Find(f => f.Semesters_Number == request.Semesters_Number && f.YearStart == request.YearStart && f.YearEnd == request.YearEnd);
            if (_semester != null)
                return HttpResponse.Error("Học kỳ và năm của học kỳ đã tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else
            {
                var Semester = new Semester()
                {
                    Semesters_Number = request.Semesters_Number,
                    YearStart = request.YearStart,
                    YearEnd = request.YearEnd,
                    CreatedDate = DateTime.Now,
                };
                _repository.Insert(Semester);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Tạo học kỳ thành công.");
            }
        }

        public async Task<HttpResponse> DeleteAsync(long Id)
        {
            var semester = _repository.Find(f => f.Id == Id);
            if(semester == null)
                return HttpResponse.Error("Không tìm thấy học kỳ.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _repository.Delete(semester);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Xóa học kỳ thành công.");
            }
        }

        public List<SemesterResponse> GetAll(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _repository.All();

            // Lọc theo từ khóa tìm kiếm nếu có
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(f =>
                    f.Semesters_Number.ToString().Contains(search) ||
                    f.YearStart.ToString().Contains(search) ||
                    f.YearEnd.ToString().Contains(search));
            }

            // Đếm tổng số bản ghi trước khi áp dụng phân trang
            totalRecords = query.Count();

            // Sắp xếp theo năm bắt đầu giảm dần, sau đó theo số kỳ giảm dần
            query = query.OrderByDescending(u => u.YearStart)
                         .ThenByDescending(u => u.Semesters_Number);

            // Áp dụng phân trang nếu cần
            if (pageNumber != -1 && pageSize != -1)
            {
                query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            }

            // Chỉ gọi ToList() ở cuối để tối ưu hóa hiệu suất
            return query.Select(f => new SemesterResponse
            {
                Id = f.Id,
                Semesters_Number = f.Semesters_Number,
                YearStart = f.YearStart,
                YearEnd = f.YearEnd
            }).ToList();
        }

        public async Task<HttpResponse> UpdateAsync(SemesterRequest request)
        {
            if (request == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var semester = _repository.Find(f => f.Id == request.Id);
            if (semester == null)
                return HttpResponse.Error("Không tìm thấy học kỳ.", System.Net.HttpStatusCode.NotFound);
            else if (_repository.Find(f => f.Semesters_Number == request.Semesters_Number && f.YearStart == request.YearStart && f.YearEnd == request.YearEnd && f.Id != request.Id) != null)
                return HttpResponse.Error("Học kỳ và năm của học kỳ đã tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else
            {
                semester.Semesters_Number = request.Semesters_Number;
                semester.YearStart = request.YearStart;
                semester.YearEnd = request.YearEnd;
                _repository.Update(semester);

                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Cập nhật học kỳ thành công.");
            }
        }
    }
}
