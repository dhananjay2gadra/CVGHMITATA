namespace CVGHMI.Models
{
    public class VehicleData
    {
        public string Plate_No { get; set; }
        public string Owner_Id { get; set; }
        public string? Calarmtime { get; set; } // Nullable DateTime
        public int Total { get; set; }
        public string log_time { get; set; }
    }
}
