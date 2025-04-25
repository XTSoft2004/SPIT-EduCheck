using Domain.Common.GoogleDriver.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Services;
using Infrastructure.ContextDB;
using Infrastructure.ContextDB.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Server_Manager.Middleware;
using System.Security.Claims;
using System.Text;
using WebApp.Configures.DIConfig;

//var builder = WebApplication.CreateBuilder(args);
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "wwwroot" // ✅ Thiết lập WebRootPath đúng cách
});

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
     // Thêm cấu hình cho file upload
    //options.MapType<IFormFile>(() => new OpenApiSchema { Type = "string", Format = "binary" });
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
            //ValidateIssuer = true,
            //ValidateAudience = true,
            //ValidateLifetime = true,
            //ValidateIssuerSigningKey = true,
            //ValidIssuer = issuer,
            //ValidAudience = audience,
            //IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            //ClockSkew = TimeSpan.Zero, // Tránh thời gian trễ khi kiểm tra token hết hạn
            RequireSignedTokens = true,
            RoleClaimType = ClaimTypes.Role,
            ValidateIssuerSigningKey = true, // Bắt buộc kiểm tra chữ ký
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)), // Khóa bí mật
            ValidateIssuer = true, // Kiểm tra Issuer
            ValidIssuer = issuer,
            ValidateAudience = true, // Kiểm tra Audience
            ValidAudience = audience,
            ValidateLifetime = true, // Kiểm tra thời gian hết hạn
            ClockSkew = TimeSpan.Zero // Không cho phép trễ thời gian
        };
    });

builder.Services.AddAuthorization(); // Bật Authorization
builder.Services.AddControllers(); // Thêm Controller

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//builder.Services.AddScoped<ITokenServices, TokenServices>();
//builder.Services.AddSingleton<IConfiguration>(builder.Configuration); 
//builder.Services.AddScoped<IUserServices, UserServices>();
//builder.Services.AddScoped<AppDbContext>();
//builder.Services.AddScoped<IRepositoryBase<RefreshToken>, RepositoryBase<RefreshToken>>();


builder.Services.AddScoped<IGoogleDriverServices, GoogleDriverSevices>();
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
app.UseStaticFiles();

//rescueContext.Database.Migrate();
HttpAppContext.Configure(app.Services.GetRequiredService<IHttpContextAccessor>());

//app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    using (var scope = context.RequestServices.CreateScope())
    {
        var middleware = new JwtMiddleware(next, context.RequestServices.GetRequiredService<IConfiguration>(), scope.ServiceProvider.GetRequiredService<ITokenServices>(), scope.ServiceProvider.GetRequiredService<IUserServices>());
        await middleware.Invoke(context);
    }
});
//app.UseMiddleware<JwtMiddleware>();
app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
    {
        var token = authHeader.Substring("Bearer ".Length).Trim();
        var parts = token.Split('.');

        if (parts.Length == 3)
        {
            try
            {
                string input = parts[0];
                string base64 = input.Replace('-', '+').Replace('_', '/'); // Chuyển đổi ký tự URL-safe
                switch (base64.Length % 4) // Thêm padding nếu thiếu
                {
                    case 2: base64 += "=="; break;
                    case 3: base64 += "="; break;
                }
                var header = Encoding.UTF8.GetString(Convert.FromBase64String(base64));
                header = header.Trim();
                if (header.Contains("\"alg\":\"none\"") || header.Contains("\"typ\":\"none\""))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new { Message = "Invalid JWT Algorithm" });
                    return;
                }
            }
            catch
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { Message = "Invalid JWT Algorithm" });
                return;
            }
        }
    }

    await next();
});


// Sử dụng Middleware
app.UseRouting();
app.UseAuthentication(); // Bật Authentication
app.UseAuthorization(); // Bật Authorization

app.MapControllers();

app.Run();
