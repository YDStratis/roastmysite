using Microsoft.EntityFrameworkCore;
using RoastMySite.Infrastructure;
using RoastMySite.Infrastructure.AI;
using RoastMySite.Infrastructure.Crawling;
using RoastMySite.Infrastructure.ExternalApis;
using RoastMySite.API.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

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
app.UseAuthorization();
app.MapControllers();

app.Run();