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

            var _semester = _repository.Find(f => f.Semesters_Number == request.Semesters_Number && f.Year == request.Year);
            if (_semester != null)
                return HttpResponse.Error("Học kỳ và năm của học kỳ đã tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else
            {
                var Semester = new Semester()
                {
                    Semesters_Number = request.Semesters_Number,
                    Year = request.Year,
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

        public List<SemesterResponse> GetAll(int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _repository.All();
            totalRecords = query.Count(); // Đếm tổng số bản ghi
           
            if (pageNumber != -1 && pageSize != -1)
            {
                // Sắp xếp phân trang
                query = query.OrderBy(u => u.Id)
                             .Skip((pageNumber - 1) * pageSize)
                             .Take(pageSize);
            }
            else
            {
                query = query.OrderBy(u => u.Id); // Sắp xếp nếu không phân trang
            }

            var semesters = query
                .Select(f => new SemesterResponse()
                {
                    Id = f.Id,
                    Semesters_Number = f.Semesters_Number,
                    Year = f.Year,
                }).ToList();

            return semesters;
        }

        public async Task<HttpResponse> UpdateAsync(SemesterRequest request)
        {
            if (request == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var semester = _repository.Find(f => f.Id == request.Id);
            if (semester == null)
                return HttpResponse.Error("Không tìm thấy học kỳ.", System.Net.HttpStatusCode.NotFound);
            else if (_repository.Find(f => f.Semesters_Number == request.Semesters_Number && f.Year == request.Year && f.Id != request.Id) != null)
                return HttpResponse.Error("Học kỳ và năm của học kỳ đã tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else
            {
                semester.Semesters_Number = request.Semesters_Number;
                semester.Year = request.Year;
                _repository.Update(semester);

                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Cập nhật học kỳ thành công.");
            }
        }
    }
}
