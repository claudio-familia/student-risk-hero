using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using student_risk_hero.Contracts;
using student_risk_hero.Data.Models;

namespace student_risk_hero.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StudentsController : BaseController<Student>
    {
        private readonly IBaseService<Student> baseService;
        private readonly IBaseService<User> userService;
        private readonly IUnitOfWork unitOfWork;

        public StudentsController(
            IBaseService<Student> baseService,
            IBaseService<User> userService,
            IUnitOfWork unitOfWork) : base(baseService)
        {
            this.baseService = baseService;
            this.userService = userService;
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public override IActionResult Get()
        {
            var students = baseService.GetAll(x => x.Include(i => i.CurrentCourse));
            return Ok(students);
        }

        [HttpPost]
        public override IActionResult Post(Student entity)
        {
            var tran = unitOfWork.CreateTransaction();
            try
            {
                var createdStudent = baseService.Add(entity);
                userService.Add(new Data.Models.User()
                {
                    Firstname = entity.Firstname,
                    Lastname = entity.Lastname,
                    Username = $"{entity.Firstname.Replace(" ", "")}{entity.Lastname.Replace(" ", "")}",
                    IsValidated = true,
                    Gender = entity.Gender,
                    Email = "claudio.familia.morel@gmail.com",
                    Password = "Unicda",
                    Role = nameof(RoleTypes.Student)
                });
                tran.Commit();
                return Ok(createdStudent);
            }
            catch(Exception ex)
            {
                tran.Rollback();
                return BadRequest(ex.Message);
            }
        }
    }
}
