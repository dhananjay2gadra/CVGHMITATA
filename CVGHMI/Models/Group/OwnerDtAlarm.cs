namespace CVGHMI.Models.Group
{
    //[{"seqnum":5,"owner_id":"MACHDEV","dvtime":null,"totalalarm":"0"},{ "seqnum":1,"owner_id":"MACHDEV","dvtime":"2024-05-09","totalalarm":"13"},{ "seqnum":3,"owner_id":"MACHDEV","dvtime":"2024-05-20","totalalarm":"3"},{ "seqnum":4,"owner_id":"MACHINDIA","dvtime":null,"totalalarm":"0"},{ "seqnum":2,"owner_id":"MACHINDIA","dvtime":"2024-05-09","totalalarm":"36"}]
    public class OwnerDtAlarm
    {

        public int seqnum { get; set; }
        public string owner_id { get; set; }
        public string? dvtime { get; set; }
        public string totalalarm { get; set; }


    }
}
