using CVGHMI.Models.Location;
using CVGHMI.Models;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
namespace CVGHMI.Controllers
{
    public class AuthController : Controller
    {
        private readonly MySqlDb _db;
        public AuthController(MySqlDb db)
        {
            _db = db;
        }
        public async Task<IActionResult> Index()
        {
            //return View();

            String usr_id = HttpContext.Session.GetString("usr_id");
            String profile_id = HttpContext.Session.GetString("profile_id");

            VehicleDataService vehicleDataService = new VehicleDataService();
            if (usr_id == null || usr_id == "")
            {
                return RedirectToAction("Index", "Login");

            }
            else
            {
                ViewBag.usr_id = usr_id;
                ViewBag.profile_id = profile_id;
                Profile profile = await vehicleDataService.GetProfileDataAsync(profile_id);

                LocData locData = new LocData();
                locData.profile = profile;
                locData.ownerInfos = await vehicleDataService.GetOwnerInfoAsync(profile_id);

                return View(locData);
            }


        }


        [HttpPost]
        public async Task<IActionResult> SaveAuth(
    string txtimienumber,
    string txtplateno,
    IFormFile fileUpload)
        {
            if (string.IsNullOrEmpty(txtimienumber) || fileUpload == null)
            {
                TempData["error"] = "Invalid data";
                return RedirectToAction("Index");
            }

            // 1️⃣ CREATE FOLDER USING CLIENTID
            string rootPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "auth_images");

            string clientFolder = Path.Combine(rootPath, txtimienumber);

            if (!Directory.Exists(clientFolder))
                Directory.CreateDirectory(clientFolder);

            // 2️⃣ SAVE IMAGE
            //string fileName = "auth.jpg";
            string datePart = DateTime.Now.ToString("hhmmssddMMyy");
            string fileName = $"{txtimienumber}_{datePart}.jpg";

            string filePath = Path.Combine(clientFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await fileUpload.CopyToAsync(stream);
            }

            // 3️⃣ SAVE DATA TO DATABASE
            using (var con = _db.GetConnection())
            {
                await con.OpenAsync();

                string sql = @"
            INSERT INTO tbl_auth
            (clientid, plateno, photo_name,dir)
            VALUES
            (@clientid, @plate, @image,@dir)";

                using var cmd = new MySqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@clientid", txtimienumber);
                cmd.Parameters.AddWithValue("@plate", txtplateno);
                cmd.Parameters.AddWithValue("@image", fileName);
                cmd.Parameters.AddWithValue("@dir", txtimienumber);
                await cmd.ExecuteNonQueryAsync();
            }

            TempData["success"] = "Authentication data saved successfully";
            return RedirectToAction("Index");
        }

    }
}
