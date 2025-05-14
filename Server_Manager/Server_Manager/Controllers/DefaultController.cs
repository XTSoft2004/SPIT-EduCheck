using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    public class DefaultController : Controller
    {
        [HttpGet("server")]
        public IActionResult Index()
        {
            return Ok("Server is running");
        }
    }
}
