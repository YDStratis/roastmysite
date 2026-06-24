using Microsoft.EntityFrameworkCore;
using RoastMySite.Core.Entities;

namespace RoastMySite.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<ScanRequest> ScanRequests => Set<ScanRequest>();
    public DbSet<ScanReport> ScanReports => Set<ScanReport>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ScanRequest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Url).IsRequired().HasMaxLength(2048);
            entity.Property(e => e.BusinessType).HasMaxLength(100);
            entity.Property(e => e.TargetAudience).HasMaxLength(200);
            entity.HasOne(e => e.Report)
                  .WithOne(r => r.ScanRequest)
                  .HasForeignKey<ScanReport>(r => r.ScanRequestId);
        });

        modelBuilder.Entity<ScanReport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OverallGrade).HasMaxLength(2);
            entity.Property(e => e.RoastSummary).HasMaxLength(1000);
        });
    }
}