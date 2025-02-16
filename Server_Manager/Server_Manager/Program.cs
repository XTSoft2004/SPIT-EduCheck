using Domain.Common.Http;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Services;
using Infrastructure.ContextDB;
using Infrastructure.ContextDB.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Server_Manager.Middleware;
using System.Text;
using WebApp.Configures.DIConfig;

var builder = WebApplication.CreateBuilder(args);

// Đảm bảo bạn đã đăng ký DbContext với DI container

DBDIConfig.Configure(builder.Services, builder.Configuration);
IdentityDIConfig.Configure(builder.Services, builder.Configuration);
//CommonDIConfig.Configure(builder.Services, builder.Configuration);



// Thêm Swagger vào DI Container
// 🛡️ Thêm JWT vào Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SPIT-EduCheck API",
        Version = "v1",
        Description = "API documentation for SPIT-EduCheck system"
    });

    // ✅ Cấu hình Bearer Token cho Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token vào đây: Bearer {your_token}"
    });

    // ✅ Bắt buộc sử dụng JWT khi gọi API
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    options.OperationFilter<AuthorizeCheckOperationFilter>();
});

// Thêm chính sách `Authorize` cho toàn bộ API (nếu cần)
//builder.Services.AddControllers(options =>
//{
//    var policy = new AuthorizationPolicyBuilder()
//        .RequireAuthenticatedUser()
//        .Build();
//    options.Filters.Add(new AuthorizeFilter(policy));
//});

// Đọc cấu hình JWT từ appsettings.json
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"];
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];
var expireMinutes = Convert.ToInt32(jwtSettings["ExpireMinutes"]);

// Cấu hình Authentication & JWT Bearer
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew = TimeSpan.Zero // Tránh thời gian trễ khi kiểm tra token hết hạn
        };
    });

builder.Services.AddAuthorization(); // Bật Authorization
builder.Services.AddControllers(); // Thêm Controller

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<TokenServices>();



builder.Services.AddScoped<IUserServices, UserServices>();
builder.Services.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI(options =>
    //{
    //    options.SwaggerEndpoint("/swagger/v1/swagger.json", "SPIT-EduCheck API v1");
    //    options.RoutePrefix = string.Empty; // Truy cập trực tiếp tại root "/"
    //});
    app.UseSwagger();
    app.UseSwaggerUI();
}

//rescueContext.Database.Migrate();
HttpAppContext.Configure(app.Services.GetRequiredService<IHttpContextAccessor>());

app.UseHttpsRedirection();

app.UseMiddleware<JwtMiddleware>();

// Sử dụng Middleware
app.UseRouting();
app.UseAuthentication(); // Bật Authentication
app.UseAuthorization(); // Bật Authorization

app.MapControllers();

app.Run();
