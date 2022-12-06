using System.ComponentModel.DataAnnotations.Schema;

namespace student_risk_hero.Data.Models.RiskProfiles
{
    public class RiskProfile:BaseEntity
    {
        public Guid StudentId { get; set; }
        public string Risk { get; set; }
        public string Description { get; set; }

        public bool? DirectorApproval { get; set; }
        public DateTime? DirectorApprovalDate { get; set; }

        public bool? ParentsApproval { get; set; }
        public DateTime? ParentsApprovalDate { get; set; }

        public bool? TeachersApproval { get; set; }
        public DateTime? TeachersApprovalDate { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        public ICollection<RiskProfileEntries>? Entries { get; set; }

        public ICollection<RiskProfileEvidence>? Evidences { get; set; }

        private string state;
        public string? State
        {
            get => state;
            set
            {

                if (value == nameof(RiskProfileStatesEnum.Draft) ||
                   value == nameof(RiskProfileStatesEnum.Approved) ||
                   value == nameof(RiskProfileStatesEnum.InProgress) ||
                   value == nameof(RiskProfileStatesEnum.Closing) ||
                   value == nameof(RiskProfileStatesEnum.Closed))
                    state = value;
                else
                    state = null;
            }
        } 
    }
}
