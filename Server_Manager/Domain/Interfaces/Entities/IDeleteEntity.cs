namespace Domain.Interfaces.Entities
{
    public interface IDeleteEntity : IEntity
    {
        bool IsDeleted { get; set; }
    }
}
