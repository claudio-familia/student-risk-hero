﻿namespace student_risk_hero.Data.Models.RiskProfiles
{
    public class RiskProfileEvidence : BaseEntity
    {
        public Guid RiskProfileId { get; set; }
        public string BlobUrl { get; set; }
    }
}
