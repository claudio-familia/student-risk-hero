using student_risk_hero.Data.Models.RiskProfiles;
using student_risk_hero.Services.Dtos;

namespace student_risk_hero.Contracts
{
    public interface IRiskProfileService: IBaseService<RiskProfile>
    {
        void Approve(Guid id, RiskProfileApprovalDto entity);
        void UpdateEntry(Guid riskProfileId, Guid entryId, RiskProfileEntryDto entity);
        void AddEntry(Guid riskProfileId, RiskProfileEntryDto entity);
        void AddEvidence(Guid riskProfileId, RiskProfileEvidenceDto entity, IFormFile asset);
        void AddClosingReason(Guid riskProfileId, RiskProfileEntryDto entity);
        void ApproveTemp(Guid id, string signer);
    }
}
