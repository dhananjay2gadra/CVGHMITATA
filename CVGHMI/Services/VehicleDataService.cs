using CVGHMI.Models;
using CVGHMI.Models.Group;
using CVGHMI.Models.Location;
using CVGHMI.Models.Organization;
using CVGHMI.Models.Query;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using static System.Net.Mime.MediaTypeNames;
using System.Text.Unicode;
using CVGHMI.Models.VideoModel;

namespace CVGHMI.Services
{
    public class VehicleDataService
    {

        public async Task<List<VehicleAlarmData>> GetVehicleDataAsync(string plateNo)
        {
            HttpClient _httpClient = new HttpClient();
            var url = $"{ConnectionSettings.connurl}dashvehalarm/{plateNo}";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var vehicleData = JsonSerializer.Deserialize<List<VehicleAlarmData>>(json);
                return vehicleData;
            }

            return new List<VehicleAlarmData>();
        }








        //public async Task<List<DeviceModal>> GetDeviceModalAsync()
        //{
        //    HttpClient _httpClient = new HttpClient();
        //    var url = $"{ConnectionSettings.connurl3}monitor/session";
        //    var response = await _httpClient.GetAsync(url);

        //    if (response.IsSuccessStatusCode)
        //    {
        //        var json = await response.Content.ReadAsStringAsync();
        //        var deviceModal = JsonSerializer.Deserialize<List<DeviceModal>>(json);
        //        return DeviceModal;
        //    }

        //    return new List<MDevice>();
        //}

        public async Task<List<DeviceModal>> GetDeviceModalAsync( )
        {
            HttpClient _httpClient = new HttpClient();
            var url = $"{ConnectionSettings.connurl3}monitor/session";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };

            return JsonSerializer.Deserialize<List<DeviceModal>>(responseBody, options);
        }



        public async Task<List<VehicleData>> GetVehicleDataOwnerAsync(string ownerId)
        {
            HttpClient _httpClient = new HttpClient();
			var url = $"{ConnectionSettings.connurl}dvas/{ownerId}";
            var response = await _httpClient.GetAsync(url);//"http://192.168.162.141:8080/dvas/" + ownerId);
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };

            return JsonSerializer.Deserialize<List<VehicleData>>(responseBody, options);
        }

        public async Task<List<OwnerAlarmData>> GetOwnerAlarmSummaryAsync(string ownerId)
        {
            HttpClient _httpClient = new HttpClient();
            var url = $"{ConnectionSettings.connurl}ownersalarm/{ownerId}";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var ownerAlarmSummary = JsonSerializer.Deserialize<List<OwnerAlarmData>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return ownerAlarmSummary;
            }

            return new List<OwnerAlarmData>();
        }

        public async Task<List<OwnerDtAlarm>> GetOwnerDtAlarmAsync(string ownerId)
        {
            HttpClient _httpClient = new HttpClient();
            var url = $"{ConnectionSettings.connurl}ownersdtalarm/{ownerId}";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var ownerDtAlarms = JsonSerializer.Deserialize<List<OwnerDtAlarm>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return ownerDtAlarms;
            }

            return new List<OwnerDtAlarm>();
        }


		public async Task<List<OwnerInfo>> GetOwnerInfoAsync(string profileid)
		{
			HttpClient _httpClient = new HttpClient();
			var url = $"{ConnectionSettings.connurl}ownerinfo/{profileid}";
			//string url = "http://192.168.162.141:8080/ownerinfo/p001";
			var response = await _httpClient.GetAsync(url);

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				var ownerinfos = JsonSerializer.Deserialize<List<OwnerInfo>>(json, new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				});
                return ownerinfos;
			}

			return new List<OwnerInfo>();
		}


		public async Task<List<OwnerVehicle>> OwnerVehicleAsync(string profileid,string ownerid)
		{
			HttpClient _httpClient = new HttpClient();
			var url = $"{ConnectionSettings.connurl}ownervehicle/{profileid}/{ownerid}";
			
			var response = await _httpClient.GetAsync(url);

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				var ownerVehicles = JsonSerializer.Deserialize<List<OwnerVehicle>>(json, new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				});
				return ownerVehicles;
			}

			return new List<OwnerVehicle>();
		}

        public async Task<List<VideoSession>> LiveVideoSession()
        {
            HttpClient _httpClient = new HttpClient();
            var url = $"{ConnectionSettings.connurl4}getAllValues";
            var response = await _httpClient.GetAsync(url);
            List<VideoSession> vidsession=new List<VideoSession>();
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var listlivevideos = JsonSerializer.Deserialize<List<string>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                foreach (string str in listlivevideos)
                {
                    string []d=str.Split("-");
                    VideoSession videoSession = new VideoSession();
                    videoSession.clientid = d[0];
                    videoSession.channel = d[1];
                    vidsession.Add(videoSession);
                    
                }
            }

            return vidsession;


        }

		public async Task<List<OwnerdtVehicle>> OwnerdtVehicleAsync(string profileid, string ownerid)
		{
			HttpClient _httpClient = new HttpClient();
			var url = $"{ConnectionSettings.connurl}ownerdtvehicle/{profileid}/{ownerid}";

			var response = await _httpClient.GetAsync(url);

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				var ownerdtVehicles = JsonSerializer.Deserialize<List<OwnerdtVehicle>>(json, new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				});
				return ownerdtVehicles;
			}

			return new List<OwnerdtVehicle>();
		}



		public async Task<List<AlarmData>> FetchQueryDataAsync(string owner,string startDate, string endDate, string type)
		{
			var url = $"{ConnectionSettings.connurl}query/{owner}/{startDate}/{endDate}/{type}";
			HttpClient _httpClient = new HttpClient();
			var response = await _httpClient.GetAsync(url);

			if (response.IsSuccessStatusCode)
			{
				var jsonResponse = await response.Content.ReadAsStringAsync();
				return JsonSerializer.Deserialize<List<AlarmData>>(jsonResponse, new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				});
			}

			return new List<AlarmData>();
		}




		public async Task<Profile> GetProfileDataAsync(string ppid)
		{
			var url = $"{ConnectionSettings.connurl}profile/{ppid}";
			HttpClient _httpClient = new HttpClient();
			var response = await _httpClient.GetAsync(url);

			if (response.IsSuccessStatusCode)
			{
				var jsonResponse = await response.Content.ReadAsStringAsync();
				return JsonSerializer.Deserialize<Profile>(jsonResponse, new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				});
			}

			return new Profile();
		}

        public async Task<List<Gps>> GetGpsAsync(string ppid)
        {
            var url = $"{ConnectionSettings.connurl}getgps/{ppid}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Gps>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<Gps>();
        }



        public async Task<List<Alarminfo>> GetAlarmAsync(string ppid)
        {
            var url = $"{ConnectionSettings.connurl}getalarminfo/{ppid}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Alarminfo>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<Alarminfo>();
        }



        public async Task<List<Contact>> GetContactAsync(string owner_id)
        {
            var url = $"{ConnectionSettings.connurl}getContact/{owner_id}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Contact>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<Contact>();
        }



        public async Task<List<OfflineModel>> GetOfflineAsync(string ppid,string logdate)
        {
            var url = $"{ConnectionSettings.connurl}getOffline/{ppid}/{logdate}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<OfflineModel>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<OfflineModel>();
        }








        public async Task<List<userinfo>> GetUserInfoAsync(string padid)
        {
            var url = $"{ConnectionSettings.connurl}getUserInfo/{padid}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<userinfo>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<userinfo>();
        }









        public async Task<List<Alarmtotalrank>> GetAlarmtotalrankAsync(string pwonerid, string pfromdt,string ptodt)
        {

            



            var url = $"{ConnectionSettings.connurl}getAlarmtotalrank/{pwonerid}/{pfromdt}/{ptodt}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Alarmtotalrank>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<Alarmtotalrank>();
        }


        public async Task<List<AlarmRank>> GetAlarmrankAsync(string plate_no, string pfromdt, string ptodt)
        {





            var url = $"{ConnectionSettings.connurl}getAlarmrank/{plate_no}/{pfromdt}/{ptodt}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<AlarmRank>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<AlarmRank>();
        }



        public async Task<List<GpsInfo>> GetOnlineAsync(string ownerid, string pfromdt, string ptodt)
        {





            var url = $"{ConnectionSettings.connurl}GetOnlineInfo/{ownerid}/{pfromdt}/{ptodt}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<GpsInfo>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<GpsInfo>();
        }


        public async Task<List<GpsInfo>> Getgpsdis24hrsAsync(string ownerid, string pfromdt, string ptodt)
        {





            var url = $"{ConnectionSettings.connurl}getgpsdis24hrs/{ownerid}/{pfromdt}/{ptodt}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<GpsInfo>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<GpsInfo>();
        }



        public async Task<List<GPSLOG>> GetgpslogsAsync(string ownerid, string pfromdt, string ptodt)
        {





            var url = $"{ConnectionSettings.connurl}Getgpslog/{ownerid}/{pfromdt}/{ptodt}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<GPSLOG>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<GPSLOG>();
        }

        



        public async Task<List<Alarmraw>> GetalarmsumrawAsync(string profileid, string pfromdt, string ptodt)
        {





            var url = $"{ConnectionSettings.connurl}getalarmsumraw/{profileid}/{pfromdt}/{ptodt}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Alarmraw>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<Alarmraw>();
        }




        public async Task<List<Device>> GetDeviceAsync(string ownerid)
        {


            var url = $"{ConnectionSettings.connurl}getDevice/{ownerid}";
            HttpClient _httpClient = new HttpClient();
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Device>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }

            return new List<Device>();
        }


       // public class CallResponse

        public async Task<CallResponse> voicecallAsync(string cid)
        {

            CallRequest callRequest = new CallRequest();    
            callRequest.clientId = cid;
            callRequest.ip = "34.100.142.100";
            callRequest.tcpPort = 6502;
            callRequest.udpPort = 9055;
            callRequest.channelNo = 1;
            callRequest.mediaType = 2;
            callRequest.streamType = 0;


            

             // var requestObj = new { clientId = cid };
             var json = JsonSerializer.Serialize(callRequest);

            using var httpClient = new HttpClient();
            httpClient.Timeout = TimeSpan.FromMinutes(1);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{ConnectionSettings.connurl2}9101";

            try
            {
                var response = await httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<CallResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                else
                {
                    CallResponse callResponse = new CallResponse();
                    // Handle different status codes as needed
                    return callResponse;// $"Error: {response.StatusCode} - {response.ReasonPhrase}";
                }
            }
            catch (Exception ex)
            {
                CallResponse callResponse = new CallResponse();
                // Handle different status codes as needed
                return callResponse;
            }
        }





        public async Task<CallResponse> voicemulticallAsync(string cid)
        {

            CallRequest callRequest = new CallRequest();
            callRequest.clientId = cid;
            callRequest.ip = "34.100.142.100";
            callRequest.tcpPort = 6503;
            callRequest.udpPort = 9055;
            callRequest.channelNo = 1;
            callRequest.mediaType = 2;
            callRequest.streamType = 0;




            // var requestObj = new { clientId = cid };
            var json = JsonSerializer.Serialize(callRequest);

            using var httpClient = new HttpClient();
            httpClient.Timeout = TimeSpan.FromMinutes(1);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{ConnectionSettings.connurl2}9101";

            try
            {
                var response = await httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<CallResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                else
                {
                    CallResponse callResponse = new CallResponse();
                    // Handle different status codes as needed
                    return callResponse;// $"Error: {response.StatusCode} - {response.ReasonPhrase}";
                }
            }
            catch (Exception ex)
            {
                CallResponse callResponse = new CallResponse();
                // Handle different status codes as needed
                return callResponse;
            }
        }




        public async Task<CallResponse> VideocallAsync(string cid,int channelno)
        {

            CallRequest callRequest = new CallRequest();
            callRequest.clientId = cid;
            callRequest.ip = "34.100.142.100";
            callRequest.tcpPort = 6502;
            callRequest.udpPort = 9009;
            callRequest.channelNo = channelno;
            callRequest.mediaType = 1;
            callRequest.streamType = 0;




            // var requestObj = new { clientId = cid };
            var json = JsonSerializer.Serialize(callRequest);

            using var httpClient = new HttpClient();
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{ConnectionSettings.connurl2}9101";

            try
            {
                var response = await httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<CallResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                else
                {
                    CallResponse callResponse = new CallResponse();
                    // Handle different status codes as needed
                    return callResponse;// $"Error: {response.StatusCode} - {response.ReasonPhrase}";
                }
            }
            catch (Exception ex)
            {
                CallResponse callResponse = new CallResponse();
                // Handle different status codes as needed
                return callResponse;
            }
        }



        public async Task<CallResponse> VideocallAsynctwo(string cid, int channelno)
        {

            CallRequest callRequest = new CallRequest();
            callRequest.clientId = cid;
            callRequest.ip = "34.100.142.100";
            callRequest.tcpPort = 7614;
            callRequest.udpPort = 9009;
            callRequest.channelNo = channelno;
            callRequest.mediaType = 1;
            callRequest.streamType = 0;




            // var requestObj = new { clientId = cid };
            var json = JsonSerializer.Serialize(callRequest);

            using var httpClient = new HttpClient();
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{ConnectionSettings.connurl2}9101";

            try
            {
                var response = await httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<CallResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                else
                {
                    CallResponse callResponse = new CallResponse();
                    // Handle different status codes as needed
                    return callResponse;// $"Error: {response.StatusCode} - {response.ReasonPhrase}";
                }
            }
            catch (Exception ex)
            {
                CallResponse callResponse = new CallResponse();
                // Handle different status codes as needed
                return callResponse;
            }
        }





        public async Task<CallResponse> VideoCallEndAsync(string cid,int channelNo)

        {

            CallEndRequest callEndRequest = new CallEndRequest();
            callEndRequest.clientId = cid;

            callEndRequest.channelNo = channelNo;
            callEndRequest.command = 0;
            callEndRequest.streamType = 0;




            // var requestObj = new { clientId = cid };
            var json = JsonSerializer.Serialize(callEndRequest);

            using var httpClient = new HttpClient();
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{ConnectionSettings.connurl2}9102";

            try
            {
                var response = await httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<CallResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                else
                {
                    CallResponse callResponse = new CallResponse();
                    // Handle different status codes as needed
                    return callResponse;// $"Error: {response.StatusCode} - {response.ReasonPhrase}";
                }
            }
            catch (Exception ex)
            {
                CallResponse callResponse = new CallResponse();
                // Handle different status codes as needed
                return callResponse;
            }
        }





        /*

        public async Task<string> voicecallAsync(String cid)
        {
            var requestobj = new {
                clientId = cid
            };
            HttpClient _httpClient = new HttpClient();
            var json=JsonSerializer.Serialize(requestobj);

            //text / plain; charset = UTF - 8

            var content=new StringContent(json,Encoding.UTF8, "application/json");
            
            var url = $"{ConnectionSettings.connurl}voicecall/";

            var response=await _httpClient.PostAsync(url,content);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<String>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            return "No Call Time Out";

        }*/




        public async Task<CallResponse> VoiceCallEndAsync(string cid)
        {

            CallEndRequest callEndRequest = new CallEndRequest();
            callEndRequest.clientId = cid;

            callEndRequest.channelNo = 1;
            callEndRequest.command = 0;
            callEndRequest.streamType = 0;




            // var requestObj = new { clientId = cid };
            var json = JsonSerializer.Serialize(callEndRequest);

            using var httpClient = new HttpClient();
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{ConnectionSettings.connurl2}9102";

            try
            {
                var response = await httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<CallResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                else
                {
                    CallResponse callResponse = new CallResponse();
                    // Handle different status codes as needed
                    return callResponse;// $"Error: {response.StatusCode} - {response.ReasonPhrase}";
                }
            }
            catch (Exception ex)
            {
                CallResponse callResponse = new CallResponse();
                // Handle different status codes as needed
                return callResponse;
            }
        }




    }
}
