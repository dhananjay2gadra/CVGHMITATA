using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class Audio : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
