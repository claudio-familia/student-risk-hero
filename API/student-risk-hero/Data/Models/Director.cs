namespace student_risk_hero.Data.Models
{
    public class Director : BaseEntity
    {
        public string Firstname { get; internal set; }
        public string? Lastname { get; internal set; }
        public string? Gender { get; internal set; }
        public Guid UserId { get; internal set; }
    }
}
