using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using student_risk_hero.Contracts;
using student_risk_hero.Data.Models;
using student_risk_hero.Services.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace student_risk_hero.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AssignmentsController : BaseController<Assignment>
    {
        private readonly IBaseService<Assignment> baseService;
        private readonly IBaseService<AssignmentStudent> assignmentStudentService;
        private readonly IBlobStorageService storageService;

        public AssignmentsController(
            IBaseService<Assignment> baseService, 
            IBaseService<AssignmentStudent> assignmentStudentService,
            IBlobStorageService StorageService) : base(baseService)
        {
            this.baseService = baseService;
            this.assignmentStudentService = assignmentStudentService;
            storageService = StorageService;
        }

        [HttpGet]
        public override IActionResult Get()
        {
            return Ok(baseService.GetAll(a => a.Include(ass => ass.Course)));
        }

        [HttpGet("{id}")]
        public override IActionResult Get(Guid id)
        {
            var entity = baseService.Get(x => x.Include(a => a.Submissions).ThenInclude(a => a.Student), a => a.Id == id);

            if (entity == null) return NotFound($"The {nameof(Assignment)} with id {id} was not found");

            return Ok(entity);
        }

        [HttpGet("course/{id}")]
        public IActionResult GetAssignments(Guid id)
        {
            return Ok(baseService.GetAll(a => a, a => a.CourseId == id));
        }

        [HttpPost("submit-homework")]
        public IActionResult SubmitHomeWork(
            [FromForm] IFormFile asset,
            [FromForm] string homework)
        {
            var _homework = JsonSerializer.Deserialize<HomeworkDto>(homework);
            if (asset == null) return BadRequest("File is not valid");

            var fileName = $"{_homework.AssignmentId}_{_homework.StudentId}_{asset.FileName}";
            Stream stream = asset.OpenReadStream();
            storageService.UploadDocument(fileName, stream);
            assignmentStudentService.Add(new AssignmentStudent()
            {
                StudentId = _homework.StudentId,
                AssignmentId = _homework.AssignmentId,
                BlobUrl = $"https://studentriskhero.blob.core.windows.net/student-risk-hero/{fileName}"
            });

            return Ok();
        }

        [HttpGet("student/{assignmentId}")]
        public IActionResult GetHomeWork(Guid assignmentId)
        {
            var homework = assignmentStudentService.Get(x => x.Include(x => x.Assignment), x => x.AssignmentId == assignmentId);
            return Ok(homework);
        }

        [HttpPost("grade/homework/student")]
        public IActionResult GradeHomeWork(AssignmentStudent assignments)
        {
            assignmentStudentService.Update(assignments);
            return Ok();
        }
    }
}
