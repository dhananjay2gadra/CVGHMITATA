using CVGHMI.Models;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.AspNetCore.StaticFiles;
using MySqlX.XDevAPI;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();


// Add services to the container.
builder.Services.AddDistributedMemoryCache(); // Add default in-memory cache for sessions
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout to 30 minutes
    options.Cookie.HttpOnly = true; // Ensure session cookie is HttpOnly
    options.Cookie.IsEssential = true; // Make session cookie essential
    //comited on developer environment
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    //options.Cookie.SameSite = SameSiteMode.Lax;

});

builder.Services.AddHttpContextAccessor(); // Register IHttpContextAccessor

// Configure Kestrel to use the settings from appsettings.json
builder.WebHost.ConfigureKestrel((context, options) =>
{
    options.Configure(context.Configuration.GetSection("Kestrel"));
});

builder.Services.AddAuthentication(IISDefaults.AuthenticationScheme);
builder.Services.AddSingleton<MySqlDb>();
var app = builder.Build();

//app.UseWebSockets(
//    
//    );



app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(120) // Adjust the keep-alive interval as needed
});


// Define WebSocket handling
app.Map("/ws", async (HttpContext context) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await CVGHMI.Models.WebSocketHandler.Handle(context, webSocket);
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});

// Define WebSocket handling
//app.Map("/ws/{clientid}", async (HttpContext context,string clientid) =>
//{
//    if (context.WebSockets.IsWebSocketRequest)
//    {
//        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
//        await CVGHMI.Models.WebSocketHandlerMultiple.Handle(context, webSocket, clientid);
//    }
//    else
//    {
//        context.Response.StatusCode = 400;
//    }
//});

// Map WebSocket endpoint with variable clientid
app.Map("/wsmultipal/{clientid}", async (HttpContext context, string clientid) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await WebSocketHandlerMultiple.Handle(context, webSocket, clientid);
    }
    else
    {
        context.Response.StatusCode = 400; // Bad request if not WebSocket
    }
});





// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    //app.UseDeveloperExceptionPage();
     app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
     app.UseHsts();
}

app.UseHttpsRedirection();

// Configure static file serving with MIME type mappings
var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".m3u8"] = "application/vnd.apple.mpegurl";
provider.Mappings[".ts"] = "video/mp2t";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});


app.UseStaticFiles();

app.UseRouting();
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllerRoute(
    name: "default",
    //pattern: "{controller=Home}/{action=Index}/{id?}");
    pattern: "{controller=Login}/{action=Index}/{id?}");

app.Run();







