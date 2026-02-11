using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI;

namespace CVGHMI.Controllers
{
    public class LogoutController : Controller
    {
        public IActionResult Index()
        {

            HttpContext.Session.Remove("usr_id");
            HttpContext.Session.Remove("profile_id");
            //HttpContext.Session.SetString("usr_id", "");
            //HttpContext.Session.SetString("profile_id","");
            // return View();
            HttpContext.Session.Clear();
            Response.Cookies.Delete(".AspNetCore.Session");

            return RedirectToAction("Index", "Login");
        }
    }
}
