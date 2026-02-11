namespace CVGHMI.Models.Organization
{
	public class OwnerVehicle
	{
		//[{"seqnum":2,"plate_no":"?A23456","total":0},{"seqnum":1,"plate_no":"JH05BS2385","total":36}]

		public int seqnum{ get; set; }
		public string plate_no { get; set; }
		public int total { get; set; }
	}
}
