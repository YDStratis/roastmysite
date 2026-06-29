using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoastMySite.API.Services;
using RoastMySite.Core.Entities;
using RoastMySite.Infrastructure;

namespace RoastMySite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScanController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ScanController> _logger;

    public ScanController(
        AppDbContext db,
        IServiceScopeFactory scopeFactory,
        ILogger<ScanController> logger)
    {
        _db = db;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<object>> CreateScan([FromBody] ScanRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { message = "Url is required." });
        }

        var scanRequest = new ScanRequest
        {
            Url = request.Url.Trim(),
            BusinessType = request.BusinessType,
            TargetAudience = request.TargetAudience
        };

        _db.ScanRequests.Add(scanRequest);
        await _db.SaveChangesAsync();

        _ = Task.Run(() => RunScanInBackgroundAsync(scanRequest.Id));

        return Accepted(new { scanId = scanRequest.Id });
    }

    [HttpGet("{scanId:guid}")]
    public async Task<IActionResult> GetScan(Guid scanId)
    {
        var scanRequest = await _db.ScanRequests
            .Include(r => r.Report)
            .FirstOrDefaultAsync(r => r.Id == scanId);

        if (scanRequest is null)
        {
            return NotFound();
        }

        // Report is null while the scan is still running; the frontend polls.
        return Ok(scanRequest);
    }

    private async Task RunScanInBackgroundAsync(Guid scanRequestId)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var scanService = scope.ServiceProvider.GetRequiredService<ScanService>();
            await scanService.RunScanAsync(scanRequestId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Scan {ScanRequestId} failed.", scanRequestId);
        }
    }
}
