using AutoMapper;
using Domain.Common.Http;
using Domain.Interfaces.Database;
using Domain.Interfaces.Logging;
using System.Security.Claims;
using System.Security.Principal;

namespace Domain.Base.Services
{
    public abstract class BaseService
    {
        readonly protected IUnitOfWork UnitOfWork;
        readonly protected IMapper Mapper;
        readonly protected IAppLogger AppLogger;
        protected Identity CurrentUser
        {
            get
            {
                return new Identity(HttpAppContext.Current.User);
            }
        }


        public BaseService()
        {
            UnitOfWork = HttpAppContext.GetRequestService<IUnitOfWork>();
            Mapper = HttpAppContext.GetRequestService<IMapper>();
            AppLogger = HttpAppContext.GetRequestService<IAppLogger>();
        }
    }
    public class Identity : IIdentity
    {
        public Identity(ClaimsPrincipal identity)
        {
            AuthenticationType = identity.Identity.AuthenticationType;
            IsAuthenticated = identity.Identity.IsAuthenticated;
            Name = identity.Identity.Name;
            long id;
            if (long.TryParse(identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value, out id))
            {
                Id = id;
            }
        }
        public string AuthenticationType { get; set; }
        public bool IsAuthenticated { get; set; }
        public string Name { get; set; }
        public long? Id { get; set; }
    }
}
