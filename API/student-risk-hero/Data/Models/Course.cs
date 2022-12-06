using System.ComponentModel.DataAnnotations.Schema;

namespace student_risk_hero.Data.Models
{
    public class Course : BaseEntity
    {
        public string Name { get; set; }
        public string School { get; set; }
        public string Description { get; set; }
        public Guid? TeacherId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        [ForeignKey("TeacherId")]
        public Teacher? Teacher { get; set; }
    }
}
