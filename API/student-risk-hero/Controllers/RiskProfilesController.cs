using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using student_risk_hero.Contracts;
using student_risk_hero.Data.Models;
using student_risk_hero.Data.Models.RiskProfiles;
using student_risk_hero.Services.Dtos;

namespace student_risk_hero.Controllers
{
    [Route("api/risk-profile")]
    [ApiController]
    [Authorize]
    public class RiskProfilesController : ControllerBase
    {
        private readonly IRiskProfileService baseService;

        public RiskProfilesController(IRiskProfileService baseService)
        {
            this.baseService = baseService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(baseService.GetAll(x => x.Include(i => i.Student)));
        }

        [HttpGet("{id}")]
        public IActionResult Get(Guid id)
        {
            var entity = baseService.Get(rp => rp.Include(x => x.Student).ThenInclude(x => x.CurrentCourse).ThenInclude(x => x.Teacher).Include(i => i.Entries).Include(i => i.Evidences), rp => rp.Id == id);

            if (entity == null) return NotFound($"The {nameof(RiskProfile)} with id {id} was not found");

            return Ok(entity);
        }

        [HttpPost]
        public IActionResult Post(RiskProfile entity)
        {
            return Ok(baseService.Add(entity));
        }

        [HttpPut]
        public IActionResult Put(RiskProfile entity)
        {
            return Ok(baseService.Update(entity));
        }

        [HttpPost("{id}/{signer}")]
        public IActionResult Approve(Guid id, string signer)
        {
            baseService.ApproveTemp(id, signer);

            return Ok();
        }

        [HttpPost("{riskProfileId}/entry")]
        public IActionResult AddEntry(
            [FromRoute] Guid riskProfileId,
            [FromBody] RiskProfileEntryDto entity)
        {
            baseService.AddEntry(riskProfileId, entity);

            return Ok();
        }

        [HttpPatch("{riskProfileId}/entry/{entryId}")]
        public IActionResult UpdateEntry(
            [FromRoute] Guid riskProfileId,
            [FromRoute] Guid entryId,
            [FromBody] RiskProfileEntryDto entity)
        {
            baseService.UpdateEntry(riskProfileId, entryId, entity);

            return Ok();
        }

        [HttpPost("{riskProfileId}/add/evidence")]
        [Consumes("multipart/form-data")]
        public IActionResult AddEvidence(
            [FromRoute] Guid riskProfileId,
            [FromForm] IFormFile asset,
            [FromForm] string Data)
        {
            var entity = JsonSerializer.Deserialize<RiskProfileEvidenceDto>(Data);
            baseService.AddEvidence(riskProfileId, entity, asset);
            return Ok();
        }

        [HttpPatch("{riskProfileId}")]
        public IActionResult AddClosingReason(
            [FromRoute] Guid riskProfileId,
            [FromBody] RiskProfileEntryDto entity)
        {
            baseService.AddClosingReason(riskProfileId, entity);

            return Ok();
        }

        [HttpPatch("{riskProfileId}/closing")]
        public IActionResult Closing([FromRoute] Guid riskProfileId)
        {
            var entity = baseService.Get(riskProfileId);

            if (entity == null) return NotFound("Risk profile not found");

            entity.State = nameof(RiskProfileStatesEnum.Closing);

            baseService.Update(entity);

            return Ok();
        }
    }
}
