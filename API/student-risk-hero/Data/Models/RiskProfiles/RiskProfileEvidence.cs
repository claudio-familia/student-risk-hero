using System.ComponentModel.DataAnnotations.Schema;

namespace student_risk_hero.Data.Models.RiskProfiles
{
    public class RiskProfileEvidence : BaseEntity
    {
        public Guid RiskProfileId { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string BlobUrl { get; set; }

        [ForeignKey("RiskProfileId")]
        public RiskProfile? RiskProfile { get; set; }
    }
}
