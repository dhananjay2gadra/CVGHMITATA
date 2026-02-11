using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class Device : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
