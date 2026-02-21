using CVGHMI.Models;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class GroupController : Controller
    {
        public async Task<IActionResult> Index()
        {

            Response.Cookies.Delete(".AspNetCore.Session");
            //String usr_id = HttpContext.Session.GetString("usr_id");
            //String profile_id = HttpContext.Session.GetString("profile_id");

            ContextRequestInfo contextRequestInfo = new ContextRequestInfo();
            UserInfoData userInfoData = await contextRequestInfo.UserInfo(HttpContext);



            if (userInfoData.usr_id == null)
            {
                return RedirectToAction("Index", "Login");

            }
            else
            {
                ViewBag.usr_id = userInfoData.usr_id;
				ViewBag.profile_id = userInfoData.profile_id;
                ViewBag.usr_role = userInfoData.usr_role;// "genral";

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
