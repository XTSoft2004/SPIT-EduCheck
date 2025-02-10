namespace Domain.Interfaces.Entities
{
    public interface IAuditEntity : IEntity
    {
        DateTime CreatedDate { get; set; }
        string CreatedBy { get; set; }
        DateTime? ModifiedDate { get; set; }
        string ModifiedBy { get; set; }
    }
}
