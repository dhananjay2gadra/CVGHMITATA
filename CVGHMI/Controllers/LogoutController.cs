using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI;

namespace CVGHMI.Controllers
{
    public class LogoutController : Controller
    {
        public IActionResult Index()
        {


            HttpContext.Session.Clear();
            Response.Cookies.Delete(".AspNetCore.Session");

            return RedirectToAction("Index", "Login");
        }
    }
}
