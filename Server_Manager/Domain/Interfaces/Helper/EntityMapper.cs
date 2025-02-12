using Domain.Common.Http;
using Domain.Interfaces.Entities;

namespace Domain.Interfaces.Helper
{
    public static class EntityMapper
    {
        public static IEntity ToNewLogEntity(IAuditEntity entity)
        {
            entity.CreatedDate = DateTime.Now;
            entity.CreatedBy = HttpAppContext.Current.User.Identity.Name;
            return entity;
        }
        public static IEntity ToUpdateLogEntity(IAuditEntity entity)
        {
            entity.ModifiedDate = DateTime.Now;
            entity.ModifiedBy = HttpAppContext.Current.User.Identity.Name;
            return entity;
        }
        public static IEntity ToDeleteLogEntity(IDeleteEntity entity, bool isDelete = true)
        {
            entity.IsDeleted = isDelete;
            return entity;
        }
    }
}
