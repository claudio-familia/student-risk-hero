using System.ComponentModel.DataAnnotations.Schema;

namespace student_risk_hero.Data.Models.RiskProfiles
{
    public class RiskProfileEntries :BaseEntity
    {
        public Guid RiskProfileId { get; set; }
        public string Finding { get; set; }
        public string Description { get; set; }
        public bool? IsClosingFinding { get; set; }
        public DateTime? Date { get; set; }

        public Guid? TeacherId { get; set; }
        public Guid? CounselorId { get; set; }
        public Guid? DirectorId { get; set; }

        [ForeignKey("RiskProfileId")]
        public RiskProfile? RiskProfile { get; set; }

        private string assistantType;
        public string? AssistantType
        {
            get => assistantType;
            set
            {

                if (value == nameof(RoleTypes.Teacher) ||
                   value == nameof(RoleTypes.Counselor) ||
                   value == nameof(RoleTypes.Director) ||
                   value == "Parent")
                    assistantType = value;
                else
                    assistantType = null;
            }
        }

        public string? ActionerId { get; internal set; }
    }
}
