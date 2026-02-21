using CVGHMI.Models;
using CVGHMI.Models.Location;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class Location : Controller
    {
		public async Task<IActionResult> Index()
        {
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

                Profile profile = await vehicleDataService.GetProfileDataAsync(userInfoData.profile_id);

				LocData locData = new LocData();
				locData.profile = profile;
				locData.ownerInfos = await vehicleDataService.GetOwnerInfoAsync(userInfoData.profile_id);

				return View(locData);
			}
        }
    }
}
