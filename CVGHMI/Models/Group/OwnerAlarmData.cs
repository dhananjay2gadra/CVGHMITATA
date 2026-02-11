namespace CVGHMI.Models.Group
{
    public class OwnerAlarmData
    {
        //[{"seqnum":1,"owner_id":"MACHDEV","noofalarm":16},{"seqnum":2,"owner_id":"MACHINDIA","noofalarm":36}]
        public int seqnum { get; set; }
        public string owner_id { get; set; }
        public int noofalarm { get; set; }
    }
}
