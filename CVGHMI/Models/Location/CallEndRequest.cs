namespace CVGHMI.Models.Location
{
    public class CallEndRequest
    {
   
        public string clientId { get; set; }
        public int channelNo { get; set; }
        public int command { get; set; }
        public int closeType { get; set; }
        public int streamType { get; set; }


    }
}
