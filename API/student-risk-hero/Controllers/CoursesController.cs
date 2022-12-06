using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using student_risk_hero.Contracts;
using student_risk_hero.Data.Models;
using student_risk_hero.Services.Dtos;

namespace student_risk_hero.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CoursesController : BaseController<Course>
    {
        private readonly IBaseService<Course> baseService;
        private readonly IBaseService<Teacher> teacherService;
        private readonly IBaseService<Student> studentService;
        private readonly IBaseService<CourseStudent> courseStudentService;

        public CoursesController(
            IBaseService<Course> baseService, 
            IBaseService<Teacher> teacherService,
            IBaseService<Student> studentService,
            IBaseService<CourseStudent> courseStudentService) : base(baseService)
        {
            this.baseService = baseService;
            this.teacherService = teacherService;
            this.studentService = studentService;
            this.courseStudentService = courseStudentService;
        }

        [HttpPost("students")]
        public IActionResult AddStudentsToCourse(CourseStudentDto data)
        {
            var response = new List<string>();

            if (!baseService.Exists(data.CourseId)) return NotFound($"Course with id {data.CourseId} was not found");

            foreach(var studentId in data.StudentsId)
            {
                if(!studentService.Exists(studentId))
                {
                    response.Add($"Student with Id {studentId} was not found");
                    continue;
                }

                courseStudentService.Add(new CourseStudent()
                {
                    CourseId = data.CourseId,
                    StudentId = studentId
                });
            }

            return Ok(response);
        }

        [HttpDelete("students")]
        public IActionResult DeleteStudentsToCourse(CourseStudentDto data)
        {
            var response = new List<string>();

            if (!baseService.Exists(data.CourseId)) return NotFound($"Course with id {data.CourseId} was not found");

            foreach (var studentId in data.StudentsId)
            {
                if (!courseStudentService.Exists(studentId))
                {
                    response.Add($"Student with Id {studentId} was not found in course");
                    continue;
                }

                var courseStudent = courseStudentService.Get(studentId);
                courseStudentService.Remove(courseStudent);
            }

            return Ok(response);
        }

        [HttpGet("{courseId}/students")]
        public IActionResult GetStudentsToCourse(Guid courseId)
        {
            var course = baseService.Get(courseId);

            if (course == null) return NotFound($"Course with id {courseId} was not found");

            var students = courseStudentService.GetAll(s => s.Include(x => x.Student), x => x.CourseId == courseId);

            return Ok(new { Students = students, Course = course});
        }

        [HttpPost("{id}/teacher/{teacherId}")]
        public IActionResult AddTeacherToCourse(Guid courseId, Guid teacherId)
        {
            var course = baseService.Get(courseId);
            var teacher = teacherService.Get(teacherId); 

            if (course == null) return NotFound($"Course with id {courseId} was not found");
            if (teacher == null) return NotFound($"Teacher with id {teacherId} was not found");

            course.TeacherId = teacherId;

            baseService.Update(course);

            return Ok();
        }
    }
}
