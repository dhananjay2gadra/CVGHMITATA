using CVGHMI.Models;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class InfoController : Controller
    {
        public async Task<IActionResult> Index()
        {


            Response.Cookies.Delete(".AspNetCore.Session");
            ContextRequestInfo contextRequestInfo = new ContextRequestInfo();
            UserInfoData userInfoData = await contextRequestInfo.UserInfo(HttpContext);

            if (userInfoData.usr_id == null)
            {
                ViewBag.adid = contextRequestInfo.getadid(HttpContext);
                return View();

            }
            else
            {
                return RedirectToAction("Index", "Home");
            }



            
        }
    }
}
