using student_risk_hero.Contracts;
using student_risk_hero.Data.Models;
using student_risk_hero.Data.Models.RiskProfiles;
using student_risk_hero.Services.Dtos;

namespace student_risk_hero.Services
{
    public class RiskProfileService : BaseService<RiskProfile>, IRiskProfileService
    {
        private readonly IBaseRepository<RiskProfileEntries> entriesRepository;
        private readonly IBaseRepository<RiskProfileEvidence> evidenceRepository;
        private readonly ICurrentUserService currentUserService;
        private readonly IBlobStorageService blobStorageService;
        private readonly IUnitOfWork unitOfWork;

        public RiskProfileService(
            IBaseRepository<RiskProfile> baseRepository,
            IBaseRepository<RiskProfileEntries> entriesRepository,
            IBaseRepository<RiskProfileEvidence> evidenceRepository,
            ICurrentUserService currentUserService,
            IBlobStorageService blobStorageService,
            IUnitOfWork unitOfWork
            ) : base(baseRepository)
        {
            this.entriesRepository = entriesRepository;
            this.evidenceRepository = evidenceRepository;
            this.currentUserService = currentUserService;
            this.blobStorageService = blobStorageService;
            this.unitOfWork = unitOfWork;
        }

        public override RiskProfile Add(RiskProfile entity)
        {
            if (entity.StudentId == null) throw new ArgumentNullException("StudentId cannot be null");
            if (string.IsNullOrEmpty(entity.Risk)) throw new ArgumentNullException("Risk cannot be null");

            entity.State = nameof(RiskProfileStatesEnum.Draft);

            return base.Add(entity);
        }

        public void AddClosingReason(Guid riskProfileId, RiskProfileEntryDto entity)
        {
            var riskProfile = base.Get(riskProfileId);

            if(riskProfile == null) throw new ArgumentException("Risk profile does not exist");

            if (riskProfile.State != nameof(RiskProfileStatesEnum.Closing))
                throw new ArgumentException("Risk profile should be in closing state to add a closing reason");

            riskProfile.State = nameof(RiskProfileStatesEnum.Closed);

            var lastEntry = new RiskProfileEntries()
            {
                RiskProfileId = riskProfileId,
                Finding = entity.Finding,
                IsClosingFinding = true,
                Date = DateTime.Now,
                Description = entity.Description,
            };

            entriesRepository.Add(lastEntry);

            base.Update(riskProfile);
        }

        public void AddEntry(Guid riskProfileId, RiskProfileEntryDto entity)
        {
            var riskProfile = base.Get(riskProfileId);

            if (riskProfile == null) throw new ArgumentException("Risk profile does not exist");

            if ((riskProfile.State == nameof(RiskProfileStatesEnum.Approved)))
            {
                riskProfile.State = nameof(RiskProfileStatesEnum.InProgress);
                base.Update(riskProfile);
            }
            else if (riskProfile.State != nameof(RiskProfileStatesEnum.InProgress))
                throw new ArgumentException("Risk profile should be in progress state to add entries");

            var entry = new RiskProfileEntries()
            {
                RiskProfileId = riskProfileId,
                Finding = entity.Finding,
                IsClosingFinding = false,
                Description = entity.Description,
                Date = DateTime.Now,
            };

            entriesRepository.Add(entry);
        }

        public void AddEvidence(Guid riskProfileId, RiskProfileEvidenceDto entity, IFormFile asset)
        {
            var riskProfile = base.Get(riskProfileId);

            if (riskProfile == null) throw new ArgumentException("Risk profile does not exist");

            if (riskProfile.State == nameof(RiskProfileStatesEnum.Closed))
                throw new ArgumentException("Risk profile should not be in closed state to add evidence");

            if (asset == null)
                throw new ArgumentException("There is not file attached");

            var trans = unitOfWork.CreateTransaction();

            try
            {
                var blobUri = $"{entity.Description}_{riskProfileId}.{asset.FileName.Split(".")[1]}";
                Stream stream = asset.OpenReadStream();
                blobStorageService.UploadDocument(blobUri, stream);
            
                var evidence = new RiskProfileEvidence()
                {
                    RiskProfileId = riskProfileId,
                    Description = entity.Description,
                    Type = entity.Type,
                    BlobUrl = $"https://studentriskhero.blob.core.windows.net/student-risk-hero/{blobUri}"
                };

                evidenceRepository.Add(evidence);
                trans.Commit();
            }
            catch(Exception ex)
            {
                trans.Rollback();
                throw;
            }
        }

        public void Approve(Guid riskProfileId, RiskProfileApprovalDto entity)
        {
            var riskProfile = base.Get(riskProfileId);

            if (riskProfile == null) throw new ArgumentException("Risk profile does not exist");

            if (riskProfile.State != nameof(RiskProfileStatesEnum.Draft))
                throw new ArgumentException("Risk profile should be in draft state to be approve");

            if (entity.ApprovalType == nameof(RoleTypes.Teacher))
            {
                riskProfile.TeachersApproval = entity.TeachersApproval;
                riskProfile.TeachersApprovalDate = entity.TeachersApprovalDate;
            }

            if (entity.ApprovalType == nameof(RoleTypes.Director))
            {
                riskProfile.DirectorApproval = entity.DirectorApproval;
                riskProfile.DirectorApprovalDate = entity.DirectorApprovalDate;
            }

            if (entity.ApprovalType == nameof(RoleTypes.Counselor))
            {
                riskProfile.ParentsApproval = entity.ParentsApproval;
                riskProfile.ParentsApprovalDate = entity.ParentsApprovalDate;
            }

            if (
                riskProfile.DirectorApproval.HasValue && riskProfile.DirectorApproval.Value &&
                riskProfile.TeachersApproval.HasValue && riskProfile.TeachersApproval.Value &&
                riskProfile.ParentsApproval.HasValue && riskProfile.ParentsApproval.Value) 
            {
                riskProfile.State = nameof(RiskProfileStatesEnum.Approved);
            }

            base.Update(riskProfile);
        }

        public void ApproveTemp(Guid riskProfileId, string signer)
        {
            var riskProfile = base.Get(riskProfileId);
            var currentDate = DateTime.Now;

            if (riskProfile == null) throw new ArgumentException("Risk profile does not exist");

            if (riskProfile.State != nameof(RiskProfileStatesEnum.Draft))
                throw new ArgumentException("Risk profile should be in draft state to be approve");

            if (signer == nameof(RoleTypes.Teacher))
            {
                riskProfile.TeachersApproval = true;
                riskProfile.TeachersApprovalDate = currentDate;
            }

            if (signer == nameof(RoleTypes.Director))
            {
                riskProfile.DirectorApproval = true;
                riskProfile.DirectorApprovalDate = currentDate;
            }

            if (signer == "Parent")
            {
                riskProfile.ParentsApproval = true;
                riskProfile.ParentsApprovalDate = currentDate;
            }

            if (
                riskProfile.DirectorApproval.HasValue && riskProfile.DirectorApproval.Value &&
                riskProfile.TeachersApproval.HasValue && riskProfile.TeachersApproval.Value &&
                riskProfile.ParentsApproval.HasValue && riskProfile.ParentsApproval.Value)
            {
                var approvalEntry = new RiskProfileEntries()
                {
                    RiskProfileId = riskProfileId,
                    Finding = RiskProfileEntriesConst.AprovalOfProfile,
                    AssistantType = signer,
                    IsClosingFinding = false,
                    Description = $"The risk profile has been approved.",
                    Date = currentDate,
                    ActionerId = currentUserService.UserId.ToString()
                };

                entriesRepository.Add(approvalEntry);
                riskProfile.State = nameof(RiskProfileStatesEnum.Approved);
            }

            base.Update(riskProfile);
        }

        public void UpdateEntry(Guid riskProfileId, Guid entryId, RiskProfileEntryDto entity)
        {
            var riskProfile = base.Get(riskProfileId);

            var entry = entriesRepository.Get(entryId);

            if (riskProfile == null) throw new ArgumentException("Risk profile does not exist");

            if (entry == null) throw new ArgumentException("Entry does not exist");

            if (riskProfile.State != nameof(RiskProfileStatesEnum.InProgress))
                throw new ArgumentException("Risk profile should be in progress state to add entries");

            entry.Finding = entity.Finding;

            entry.Description = entity.Description;

            entry.Date = entity.Date;

            entriesRepository.Update(entry);
        }
    }
}
