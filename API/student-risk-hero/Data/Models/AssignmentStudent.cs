using System.ComponentModel.DataAnnotations.Schema;

namespace student_risk_hero.Data.Models
{
    public class AssignmentStudent: BaseEntity
    {
        public Guid AssignmentId { get; set; }
        public Guid StudentId { get; set; }
        public string BlobUrl { get; set; }
        public decimal? Grade { get; set; }
        public string? Comments { get; set; }

        [ForeignKey("AssignmentId")]
        public Assignment? Assignment { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }
}
