using Microsoft.EntityFrameworkCore;
using RoastMySite.Infrastructure;
using RoastMySite.Infrastructure.AI;
using RoastMySite.Infrastructure.Crawling;
using RoastMySite.Infrastructure.ExternalApis;
using RoastMySite.API.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
const string FrontendDevCorsPolicy = "FrontendDevCors";

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Local frontend development
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendDevCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// HTTP Clients
builder.Services.AddHttpClient<WebsiteCrawler>();

// PageSpeed Service
builder.Services.AddHttpClient();
builder.Services.AddScoped<PageSpeedService>(sp =>
{
    var factory = sp.GetRequiredService<IHttpClientFactory>();
    var client = factory.CreateClient();
    var config = sp.GetRequiredService<IConfiguration>();
    return new PageSpeedService(client, config["PageSpeed:ApiKey"]);
});

// AI Service
builder.Services.AddScoped<ClaudeAiService>(sp =>
{
    var factory = sp.GetRequiredService<IHttpClientFactory>();
    var client = factory.CreateClient();
    var config = sp.GetRequiredService<IConfiguration>();
    return new ClaudeAiService(client, config["Anthropic:ApiKey"] ?? "");
});

// Services
builder.Services.AddScoped<ScanService>();

// Controllers
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => options.WithTitle("RoastMySite API"));
}

app.UseHttpsRedirection();
if (app.Environment.IsDevelopment())
{
    app.UseCors(FrontendDevCorsPolicy);
}

app.UseAuthorization();
app.MapControllers();

app.Run();
