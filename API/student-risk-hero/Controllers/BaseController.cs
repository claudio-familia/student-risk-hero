using Microsoft.AspNetCore.Mvc;
using student_risk_hero.Contracts;

namespace student_risk_hero.Controllers
{
    public class BaseController<T> : ControllerBase
    {
        private readonly IBaseService<T> baseService;

        public BaseController(IBaseService<T> baseService)
        {
            this.baseService = baseService;
        }

        [HttpGet]
        public virtual IActionResult Get()
        {
            return Ok(baseService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult Get(Guid id)
        {
            var entity = baseService.Get(id);

            if (entity == null) return NotFound($"The {nameof(T)} with id {id} was not found");

            return Ok(entity);
        }

        [HttpPost]
        public virtual IActionResult Post(T entity)
        {
            return Ok(baseService.Add(entity));
        }

        [HttpPut]
        public IActionResult Put(T entity)
        {
            return Ok(baseService.Update(entity));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            baseService.Remove(id);

            return Ok();
        }
    }
}