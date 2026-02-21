using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GCSController : Controller
    {
        private StorageClient _storageClient;
        private readonly string _bucketName = "tsl-dfms-storage-prod"; // Set your bucket name here

        public GCSController()
        {
            // Provide the path to the JSON key file for authentication
            var credentialsPath = "C:\\Users\\MACINDUSR\\Documents\\tsl-dfms-prod-6948487d6686.json";
            var storageClientBuilder = new StorageClientBuilder
            {
                CredentialsPath = credentialsPath
            };

            _storageClient = storageClientBuilder.Build();

        }

        [HttpGet("image/{dirName}/{fileName}")]
        public IActionResult GetImage(string dirName, string fileName)
        {


            try
            {
                fileName = "alarm/" + dirName + "/" + fileName;
                var objectName = fileName;

                // Get the object from Cloud Storage
                var memoryStream = new MemoryStream();
                _storageClient.DownloadObject(_bucketName, objectName, memoryStream);
                memoryStream.Seek(0, SeekOrigin.Begin);

                return File(memoryStream, "image/jpeg"); // or "image/png" based on your image type
            }
            catch (Exception ex)
            {
                return NotFound($"Image not found: {ex.Message}");
            }
        }

        [HttpGet("video/{dirName}/{fileName}")]
        public IActionResult GetVideo(string dirName, string fileName)
        {
            try
            {

                fileName = "alarm/" + dirName + "/" + fileName;
                var objectName = fileName;

                // Get the object from Cloud Storage
                var memoryStream = new MemoryStream();
                _storageClient.DownloadObject(_bucketName, objectName, memoryStream);
                memoryStream.Seek(0, SeekOrigin.Begin);

                return File(memoryStream, "video/mp4"); // Change this based on your video format
            }
            catch (Exception ex)
            {
                return NotFound($"Video not found: {ex.Message}");
            }
        }

        [HttpGet("fivideo/{dirName}/{fileName}")]
        public async Task<IActionResult> fiVideo(string dirName, string fileName)
        {
            try
            {
                // Construct the full HTTPS URL
                string videoUrl = $"https://10.137.9.50:5001/jt_data/alarm_file/{dirName}/{fileName}";

                // Create HttpClient that bypasses self-signed SSL issues (safe for internal use)
                var handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (sender, cert, chain, sslErrors) => true
                };

                using var httpClient = new HttpClient(handler);

                // Fetch the video file
                var response = await httpClient.GetAsync(videoUrl, HttpCompletionOption.ResponseHeadersRead);
                if (!response.IsSuccessStatusCode)
                {
                    return NotFound($"Video not found or cannot be fetched (status: {response.StatusCode}).");
                }

                // Get stream
                var videoStream = await response.Content.ReadAsStreamAsync();
                var contentType = response.Content.Headers.ContentType?.ToString() ?? "video/mp4";

                // Stream it to browser
                return File(videoStream, contentType);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error loading video: {ex.Message}");
            }
        }


        [HttpGet("fiimage/{dirName}/{fileName}")]
        public async Task<IActionResult> fiimage(string dirName, string fileName)
        {
            try
            {
                // Construct the full HTTPS URL
                string imageUrl = $"https://10.137.9.50:5001/jt_data/alarm_file/{dirName}/{fileName}";

                // Create HttpClient that bypasses self-signed SSL issues (safe for internal use)
                var handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (sender, cert, chain, sslErrors) => true
                };

                using var httpClient = new HttpClient(handler);

                // Fetch the video file
                var response = await httpClient.GetAsync(imageUrl, HttpCompletionOption.ResponseHeadersRead);
                if (!response.IsSuccessStatusCode)
                {
                    return NotFound($"Image not found or cannot be fetched (status: {response.StatusCode}).");
                }

                // Get stream
                var videoStream = await response.Content.ReadAsStreamAsync();
                var contentType = response.Content.Headers.ContentType?.ToString() ?? "image/jpeg";

                // Stream it to browser
                return File(videoStream, contentType);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error loading image: {ex.Message}");
            }
        }




    }
}
