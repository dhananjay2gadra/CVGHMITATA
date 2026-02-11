using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class GroupController : Controller
    {
        public IActionResult Index()
        {


			String usr_id = HttpContext.Session.GetString("usr_id");
			String profile_id = HttpContext.Session.GetString("profile_id");





			if (usr_id == null || usr_id == "")
			{
				return RedirectToAction("Index", "Login");

			}
			else
			{
				ViewBag.usr_id = usr_id;
				ViewBag.profile_id = profile_id;

				// Example data
				var categories = new[] { "Jan", "Feb", "Mar", "Apr", "May" };
				var seriesData = new[] { 29.9, 71.5, 106.4, 129.2, 144.0 };

				ViewBag.Categories = categories;
				ViewBag.SeriesData = seriesData;
			}
				return View();
        }


    }
}
