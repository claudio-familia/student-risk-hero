using student_risk_hero.Data.Models;

namespace student_risk_hero.Services.Dtos
{
    public class RiskProfileApprovalDto
    {
        public string Description { get; set; }
        public DateTime? Date { get; set; }

        public Guid? TeacherId { get; set; }
        public Guid? CounselorId { get; set; }
        public Guid? DirectorId { get; set; }

        private string approvalType;
        public string ApprovalType
        {
            get => approvalType;
            set
            {

                if (value == nameof(RoleTypes.Teacher) ||
                   value == nameof(RoleTypes.Counselor) ||
                   value == nameof(RoleTypes.Director))
                    approvalType = value;
                else
                    approvalType = null;
            }
        }

        public DateTime? TeachersApprovalDate { get; internal set; }
        public bool? TeachersApproval { get; internal set; }
        public bool? DirectorApproval { get; internal set; }
        public DateTime? DirectorApprovalDate { get; internal set; }
        public bool? ParentsApproval { get; internal set; }
        public DateTime? ParentsApprovalDate { get; internal set; }
    }
}
