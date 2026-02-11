using MySql.Data.MySqlClient;

namespace CVGHMI.Models
{
    public class MySqlDb
    {
        private readonly string _connectionString;

        public MySqlDb(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MySqlConnection");
        }

        public MySqlConnection GetConnection()
        {
            return new MySqlConnection(_connectionString);
        }
    }
}
