﻿using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Lecturer;
using Domain.Model.Response.Class;
using Domain.Model.Response.Lecturer;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class LecturerServices : BaseService, ILecturerServices
    {
        private readonly IRepositoryBase<Lecturer> _repository;

        public LecturerServices(IRepositoryBase<Lecturer> repository)
        {
            _repository = repository;
        }

        public async Task<HttpResponse> CreateAsync(LecturerRequest lecturerRequest)
        {
            if(lecturerRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var Lecturer = new Lecturer()
            {
                FullName = lecturerRequest.FullName,
                Email = lecturerRequest.Email,
                PhoneNumber = lecturerRequest.PhoneNumber,
                CreatedDate = DateTime.Now,
            };
            _repository.Insert(Lecturer);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Tạo giảng viên thành công.");
        }

        public async Task<HttpResponse> UpdateAsync(LecturerRequest lecturerRequest)
        {
            if(lecturerRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _lecturer = _repository.Find(f => f.Id == lecturerRequest.Id);
            if(_lecturer == null)
                return HttpResponse.Error("Không tìm thấy giảng viên.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _lecturer.FullName = lecturerRequest.FullName;
                _lecturer.Email = lecturerRequest.Email;
                _lecturer.PhoneNumber = lecturerRequest.PhoneNumber;
                _repository.Update(_lecturer);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Cập nhật giảng viên thành công.");
            }
        }
        public async Task<HttpResponse> DeleteAsync(long Id)
        {
            var lecturer = _repository.Find(f => f.Id == Id);
            if(lecturer == null)
                return HttpResponse.Error("Không tìm thấy giảng viên.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _repository.Delete(lecturer);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Xóa giảng viên thành công.");
            }
        }

        public List<LecturerResponse> GetAll(int pageNumber, int pageSize, out int totalRecords)
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

            var lecturers = query
                .Select(s => new LecturerResponse()
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    Email = s.Email,
                    PhoneNumber = s.PhoneNumber,
                    ClassResponse = s.Class.Select(s => new ClassResponse()
                    {
                        Id = s.Id,
                        Code = s.Code,
                        Name = s.Name,
                        TimeStart = s.TimeStart,
                        TimeEnd = s.TimeEnd,
                    }).ToList()
                }).ToList();

            return lecturers;
        }

    }
}
