using Domain.Interfaces.Database;
using Infrastructure.ContextDB;

namespace Infrastructure.ContextDB
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;

        public UnitOfWork(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public int Commit()
        {
            return _dbContext.SaveChanges();
        }

        public Task<int> CommitAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    }
}
