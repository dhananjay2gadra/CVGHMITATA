using System.Net.WebSockets;
using System.Text;
using System.Threading;

namespace CVGHMI.Models
{
    public static class WebSocketHandlerMultiple
    {
        public static async Task Handle(HttpContext context, WebSocket webSocket,string clientid)
        {
            var buffer = new byte[4096 * 28];

            // Create a new ClientWebSocket for each connection
            using (var clientWebSocket = new ClientWebSocket())
            {
                // Connect to the Spring Boot WebSocket server
                //await clientWebSocket.ConnectAsync(new Uri("ws://localhost:6605/audio_in"), CancellationToken.None);
                await clientWebSocket.ConnectAsync(new Uri("ws://10.137.9.50:6504/audio_in/" + clientid), CancellationToken.None);

                // Start tasks to handle sending and receiving in parallel
                var sendTask = Task.Run(async () => await SendMessagesToSpringBootServer(webSocket, clientWebSocket));
                var receiveTask = Task.Run(async () => await ReceiveMessagesFromSpringBootServer(webSocket, clientWebSocket));

                // Wait for either task to complete (or the connection to close)
                await Task.WhenAny(sendTask, receiveTask);

                // Close both connections when either task is done
                if (clientWebSocket.State == WebSocketState.Open)
                {
                    await clientWebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the ASP.NET server", CancellationToken.None);
                }
                if (webSocket.State == WebSocketState.Open)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the ASP.NET server", CancellationToken.None);
                }
            }
        }

        private static async Task SendMessagesToSpringBootServer(WebSocket webSocket, ClientWebSocket clientWebSocket)
        {
            var buffer = new byte[4096 * 28];


            // Loop to receive messages from the ASP.NET client WebSocket and send them to Spring Boot WebSocket
            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Binary)
                {
                    var receivedData = new byte[result.Count];
                    Array.Copy(buffer, receivedData, result.Count);
                    Console.WriteLine($"Received from client: {BitConverter.ToString(receivedData)}");

                    // Send the data to the Spring Boot server
                    await clientWebSocket.SendAsync(new ArraySegment<byte>(receivedData), WebSocketMessageType.Binary, true, CancellationToken.None);
                }

                if (result.CloseStatus.HasValue)
                {
                    Console.WriteLine("Web Socket is Closed");
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the ASP.NET server", CancellationToken.None);
                    break; // Exit loop if connection is closing
                }
            }
            Console.WriteLine("WebSocket Not Found");
        }

        private static async Task ReceiveMessagesFromSpringBootServer(WebSocket webSocket, ClientWebSocket clientWebSocket)
        {
            var buffer = new byte[4096 * 28];
            //using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
            // Loop to receive messages from the Spring Boot WebSocket and send them to ASP.NET client WebSocket
            while (clientWebSocket.State == WebSocketState.Open)
            {
                Console.WriteLine("jai shri ram");

                try
                {

                    var result = await clientWebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);



                    if (result.MessageType == WebSocketMessageType.Binary)
                    {
                        var message = new byte[result.Count];
                        Array.Copy(buffer, message, result.Count);
                        Console.WriteLine($"Received from Spring Boot server: {BitConverter.ToString(message)}");

                        // Send the message to the ASP.NET client WebSocket
                        await webSocket.SendAsync(new ArraySegment<byte>(message), WebSocketMessageType.Binary, true, CancellationToken.None);
                    }

                    if (result.CloseStatus.HasValue)
                    {
                        Console.WriteLine("Client Web Socket is Closed");
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the ASP.NET server", CancellationToken.None);
                        break; // Exit loop if connection is closing
                    }
                }catch(WebSocketException)
                {
                    Console.WriteLine("Jai Hanuman");
                }
            }
            Console.WriteLine("ClientWebSocket not Found");
        }
    }
}
