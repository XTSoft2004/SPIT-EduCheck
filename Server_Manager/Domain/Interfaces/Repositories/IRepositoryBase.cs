using System.Data;
using System.Linq.Expressions;

namespace Domain.Interfaces.Repositories
{
    public interface IRepositoryBase<T> where T : class
    {
        /// <summary>
        /// Find an entity with expression
        /// </summary>
        /// <param name="expression"></param>
        /// <returns>Entity</returns>
        T Find(Expression<Func<T, bool>> expression);

        /// <summary>
        /// Find an entity with expression
        /// </summary>
        /// <param name="expression"></param>
        /// <returns>Entity</returns>
        Task<T> FindAsync(Expression<Func<T, bool>> expression, string includeTable = "");

        /// <summary>
        /// Find all entities in a table
        /// </summary>
        /// <param name="expression"></param>
        /// <returns>List of entities</returns>
        IQueryable<T> All();

        /// <summary>
        /// Find entities with expression
        /// </summary>
        /// <param name="expression"></param>
        /// <returns>List of entities</returns>
        IQueryable<T> ListBy(Expression<Func<T, bool>> expression);

        /// <summary>
        /// Update an Entity
        /// </summary>
        /// <param name="entity">Entity need to update</param>
        void Update(T entity);

        /// <summary>
        /// Update a list of Entities
        /// </summary>
        /// <param name="entities">Entities need to update</param>
        void UpdateRange(IEnumerable<T> entities);

        /// <summary>
        /// Delete an entity permanently from db
        /// </summary>
        /// <param name="entity"></param>
        void TotallyDelete(T entity);

        /// <summary>
        /// Delete an Entity
        /// </summary>
        /// <param name="entity">Entity need to Delete</param>
        void Delete(T entity);

        /// <summary>
        /// Delete a list of Entities
        /// </summary>
        /// <param name="entities">List entities need to Delete</param>
        void DeleteRange(IEnumerable<T> entities);

        /// <summary>
        /// Add new Entity
        /// </summary>
        /// <param name="entity">New Entity</param>
        void Insert(T entity);

        /// <summary>
        /// Add a list of Entities
        /// </summary>
        /// <param name="entities">New Entities</param>
        void InsertRange(IEnumerable<T> entities);

        /// <summary>
        /// Execute SqlCommand
        /// </summary>
        /// <param name="sql">SqlCommand</param>
        /// <param name="parameters">Sql parameters</param>
        /// <returns></returns>
        int ExcecuteCommand(string sql, params object[] parameters);

        /// <summary>
        /// Execute SqlCommand
        /// </summary>
        /// <param name="sql">SqlCommand</param>
        /// <param name="parameters">Sql parameters</param>
        /// <returns></returns>
        Task<int> ExcecuteCommandAsync(string sql, params object[] parameters);

        /// <summary>
        /// Execute Sql Qeury
        /// </summary>
        /// <typeparam name="TResult">Type of result returned</typeparam>
        /// <param name="sql">SqlQuery</param>
        /// <param name="commandType">SP or Text</param>
        /// <param name="parameters">Sql parameters</param>
        /// <returns></returns>
        IEnumerable<TResult> ExcecuteQuery<TResult>(string sql
            , CommandType commandType = CommandType.Text
            , params object[] parameters
            ) where TResult : new();

        /// <summary>
        /// Execute Sql Qeury
        /// </summary>
        /// <typeparam name="TResult">Type of result returned</typeparam>
        /// <param name="sql">SqlQuery</param>
        /// <param name="commandType">SP or Text</param>
        /// <param name="parameters">Sql parameters</param>
        /// <returns></returns>
        Task<IEnumerable<TResult>> ExcecuteQueryAsync<TResult>(string sql
            , CommandType commandType = CommandType.Text
            , params object[] parameters
            ) where TResult : new();
    }
}
