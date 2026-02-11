using System.Text.Json.Serialization;

namespace CVGHMI.Models.Query
{
	public class AlarmData
	{
		[JsonPropertyName("plate_no")]
		public string PlateNo { get; set; }

		[JsonPropertyName("device_id")]
		public string DeviceId { get; set; }

		[JsonPropertyName("device_model")]
		public string DeviceModel { get; set; }

		[JsonPropertyName("maker_id")]
		public string MakerId { get; set; }

		[JsonPropertyName("plate_color")]
		public string PlateColor { get; set; }

		[JsonPropertyName("province_id")]
		public string ProvinceId { get; set; }

		[JsonPropertyName("owner_id")]
		public string OwnerId { get; set; }

		[JsonPropertyName("id")]
		public string Id { get; set; }

		[JsonPropertyName("latitude")]
		public string Latitude { get; set; }

		[JsonPropertyName("longitude")]
		public string Longitude { get; set; }

		[JsonPropertyName("speed")]
		public string Speed { get; set; }

		[JsonPropertyName("type")]
		public string Type { get; set; }

		[JsonPropertyName("direction")]
		public string Direction { get; set; }

		[JsonPropertyName("devicetime")]
		public string DeviceTime { get; set; }

		[JsonPropertyName("alarmid")]
		public string AlarmId { get; set; }

		[JsonPropertyName("path")]
		public string Path { get; set; }
		[JsonPropertyName("pic")]
		public string pic { get; set; }

		[JsonPropertyName("vid")]
		public string vid { get; set; }

	}
}
