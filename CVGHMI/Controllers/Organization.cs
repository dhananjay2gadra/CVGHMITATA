using CVGHMI.Models;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class Organization : Controller
    {
		public async Task<IActionResult> Index()
        {
            //String usr_id = HttpContext.Session.GetString("usr_id");
            //String profile_id = HttpContext.Session.GetString("profile_id");
            Response.Cookies.Delete(".AspNetCore.Session");
            ContextRequestInfo contextRequestInfo = new ContextRequestInfo();
            UserInfoData userInfoData = await contextRequestInfo.UserInfo(HttpContext);


            VehicleDataService vehicleDataService = new VehicleDataService();




            if (userInfoData.usr_id == null)
            {
                return RedirectToAction("Index", "Login");

            }
            else
            {
                ViewBag.usr_id = userInfoData.usr_id;
				ViewBag.profile_id = userInfoData.profile_id;
                ViewBag.usr_role = userInfoData.usr_role;// "genral";
                var ownerinfos = await vehicleDataService.GetOwnerInfoAsync(userInfoData.profile_id);




				return View(ownerinfos);
			}
        }
    }
}
