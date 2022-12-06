using System.ComponentModel.DataAnnotations.Schema;

namespace student_risk_hero.Data.Models
{
    public class Assignment: BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public Guid CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course? Course { get; set; }

        public ICollection<AssignmentStudent>? Submissions { get; set; }
    }
}
