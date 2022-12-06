using Newtonsoft.Json;

namespace student_risk_hero.Services.Dtos
{
    public class RiskProfileEvidenceDto
    {
        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }
    }
}
