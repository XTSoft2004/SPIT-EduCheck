using Domain.Interfaces.Helper;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using Domain.Common.Extensions;
using Domain.Interfaces.Entities;
using System.Data;
using System.Linq.Expressions;
using Infrastructure.ContextDB;

namespace Infrastructure.ContextDB.Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T>
        where T : class
    {
        protected readonly DbSet<T> _dbSet;

        public RepositoryBase(AppDbContext dbContext)
        {
            DbContext = dbContext;
            _dbSet = DbContext.Set<T>();
        }

        protected AppDbContext DbContext { get; }

        public IQueryable<T> All()
        {
            return _dbSet.AsQueryable();
        }

        public void TotallyDelete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void Delete(T entity)
        {
            if (typeof(T).GetInterfaces().Contains(typeof(IDeleteEntity)))
            {
                entity = (T)EntityMapper.ToDeleteLogEntity(entity as IDeleteEntity);
                Update(entity);
            }
            else
            {
                _dbSet.Remove(entity);
            }
        }

        public void DeleteRange(IEnumerable<T> entities)
        {
            if (typeof(T).GetInterfaces().Contains(typeof(IDeleteEntity)))
            {
                var deleteEntities = entities.ToList();

                for (int i = 0; i < deleteEntities.Count; i++)
                {
                    deleteEntities[i] = (T)EntityMapper.ToDeleteLogEntity(deleteEntities[i] as IDeleteEntity);
                }
                UpdateRange(entities);
            }
            else
            {
                _dbSet.RemoveRange(entities);
            }
        }

        public int ExcecuteCommand(string sql, params object[] parameters)
        {
            return DbContext.Database.ExecuteSqlRaw(sql, parameters);
        }

        public Task<int> ExcecuteCommandAsync(string sql, params object[] parameters)
        {
            return DbContext.Database.ExecuteSqlRawAsync(sql, parameters);
        }

        public IEnumerable<TResult> ExcecuteQuery<TResult>(string sql
            , CommandType commandType = CommandType.Text
            , params object[] parameters
            ) where TResult : new()
        {
            using (var command = DbContext.Database.GetDbConnection().CreateCommand())
            {
                command.CommandType = commandType;
                command.CommandText = sql;
                command.Parameters.AddRange(parameters);
                DbContext.Database.OpenConnection();
                using (var result = command.ExecuteReader())
                {
                    var table = result.GetSchemaTable();
                    var dtTable = new DataTable();
                    dtTable.Load(result);
                    return dtTable.ToObjects<TResult>();
                }
            }
        }

        public async Task<IEnumerable<TResult>> ExcecuteQueryAsync<TResult>(string sql
            , CommandType commandType = CommandType.Text
            , params object[] parameters
            ) where TResult : new()
        {
            using (var command = DbContext.Database.GetDbConnection().CreateCommand())
            {
                command.CommandType = commandType;
                command.CommandText = sql;
                command.Parameters.AddRange(parameters);
                await DbContext.Database.OpenConnectionAsync();
                using (var result = await command.ExecuteReaderAsync())
                {
                    var table = result.GetSchemaTable();
                    var dtTable = new DataTable();
                    dtTable.Load(result);
                    return dtTable.ToObjects<TResult>();
                }
            }
        }

        public T Find(Expression<Func<T, bool>> expression)
        {
            return _dbSet.Where(expression).FirstOrDefault();
        }

        public Task<T> FindAsync(Expression<Func<T, bool>> expression, string includeTable = "")
        {
            if(String.IsNullOrEmpty(includeTable))
            {
                return _dbSet.Where(expression).FirstOrDefaultAsync();
            }
            return _dbSet.Where(expression).Include(includeTable).FirstOrDefaultAsync();
        }

        public void Insert(T entity)
        {
            if (typeof(T).GetInterfaces().Contains(typeof(IAuditEntity)))
            {
                entity = (T)EntityMapper.ToNewLogEntity(entity as IAuditEntity);
            }
            _dbSet.Add(entity);
        }

        public void InsertRange(IEnumerable<T> entities)
        {
            if (typeof(T).GetInterfaces().Contains(typeof(IAuditEntity)))
            {
                var insertEntities = entities.ToList();
                for (int i = 0; i < insertEntities.Count; i++)
                {
                    insertEntities[i] = (T)EntityMapper.ToNewLogEntity(insertEntities[i] as IAuditEntity);
                }
            }
            _dbSet.AddRange(entities);
        }

        public IQueryable<T> ListBy(Expression<Func<T, bool>> expression)
        {
            return _dbSet.Where(expression);
        }

        public void Update(T entity)
        {
            if (typeof(T).GetInterfaces().Contains(typeof(IAuditEntity)))
            {
                entity = (T)EntityMapper.ToUpdateLogEntity(entity as IAuditEntity);
            }
            DbContext.Entry(entity).State = EntityState.Modified;
        }

        public void UpdateRange(IEnumerable<T> entities)
        {
            if (typeof(T).GetInterfaces().Contains(typeof(IAuditEntity)))
            {
                var insertEntities = entities.ToList();
                for (int i = 0; i < insertEntities.Count; i++)
                {
                    insertEntities[i] = (T)EntityMapper.ToUpdateLogEntity(insertEntities[i] as IAuditEntity);
                }
            }
            entities.ToList().ForEach(entity => Update(entity));
        }
    }
}
