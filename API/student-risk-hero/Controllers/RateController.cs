using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using student_risk_hero.Data.Models;
using System.Net;

namespace student_risk_hero.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class RateController : ControllerBase
    {
        [HttpGet("{from}/{to}")]
        public IActionResult GetRateByCur([FromRoute] string from, [FromRoute] string to)
        {
            try
            {
                var client = new RestClient("https://api.exchangerate.host");
                var request = new RestRequest("/convert").AddQueryParameter("from", from).AddQueryParameter("to", to);

                var response = client.Get<RateResponse>(request);
                
                return Ok(new {Rate= response.result,Amount= response.query.amount,From=response.query.from, To = response.query.to });
            }
            catch (Exception)
            {

                return BadRequest();
            }



        }
    }
}
