using CVGHMI.Models;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CVGHMI.Controllers
{
    public class LoginController : Controller
    {
        public async Task<IActionResult> Index()
        {
            var adid = HttpContext.User.Identity.Name;
            //ViewBag.adid = adid;
            var usrname = "";
            if (adid != null)
            {
                var info = adid.Split('\\');
                if (info.Length > 0)
                {
                    //ViewBag.adid = info[0] + "," + info[1];
                    usrname = info[1];
                }
            }
            //else
           // {


            //    ViewBag.adid = adid;
           // }



            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetUserInfoAsync(usrname);
           if(data.Count<=0)
            {
                return RedirectToAction("Index", "Info");
            }
            else
            {
                HttpContext.Session.SetString("usr_id", data[0].adid.ToString());// userProfiles[0].user_id.ToString());
                HttpContext.Session.SetString("profile_id", data[0].profileid.ToString());// userProfiles[0].profileid.ToString());
                HttpContext.Session.SetString("usr_role", data[0].role.ToString());
                return RedirectToAction("Index", "Home");

                //return View("Index", null);
            }


            
           // return View();
        }

        public async Task<IActionResult> Auth(string usr_id, string usr_password)
        {
            //var adid = HttpContext.User.Identity.Name;
            //ViewBag.adid=adid;


            string url = $"{ConnectionSettings.connurl}auth/" + usr_id + "/" + usr_password;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    // Send the GET request
                    HttpResponseMessage response = await client.GetAsync(url);

                    // Check if the response is successful
                    if (response.IsSuccessStatusCode)
                    {

                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        // Deserialize the JSON response into a list of UserProfile objects
                        List<UserProfile> userProfiles = JsonSerializer.Deserialize<List<UserProfile>>(jsonResponse);

                        if (userProfiles != null && userProfiles.Count > 0)
                        {
                            ViewBag.UserProfiles = userProfiles;
                            HttpContext.Session.SetString("usr_id", userProfiles[0].user_id.ToString());
                            HttpContext.Session.SetString("profile_id", userProfiles[0].profileid.ToString());
                            return RedirectToAction("Index", "Home");
                            //_logger.LogInformation("Successfully fetched and deserialized user profiles.");
                        }
                        else
                        {
                            return RedirectToAction("Index", "Login");
                            // _logger.LogWarning("No user profiles found in the response.");
                        }

                    }
                    else
                    {
                        Console.WriteLine($"Request failed. Status code: {response.StatusCode}");
                        return RedirectToAction("Index", "Login");
                    }
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine($"Request error: {e.Message}");
                    return RedirectToAction("Index", "Login");
                }
                catch (Exception e)
                {
                    Console.WriteLine($"An unexpected error occurred: {e.Message}");
                    return RedirectToAction("Index", "Login");
                }
            }



        }

    }
}
