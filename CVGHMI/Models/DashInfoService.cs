using System.Text.Json;

namespace CVGHMI.Models
{
    public class DashInfoService
    {

        public async Task<List<DashInfo>> GetDashInfoAsync(string profileId)
        {

            string url = $"{ConnectionSettings.connurl}DashInfo/{profileId}"; 

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    // Send the GET request
                    HttpResponseMessage response = await client.GetAsync(url);
                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        // Deserialize the JSON response into a list of UserProfile objects
                        List<DashInfo> listdashinfo = JsonSerializer.Deserialize<List<DashInfo>>(jsonResponse);

                       return listdashinfo;

                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception ex)
                {
                   return null;
                }
            }
        }
    }
}
