using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class Audio : Controller
    {
        public IActionResult Index()
        {
            Response.Cookies.Delete(".AspNetCore.Session");
            return View();
        }
    }
}
