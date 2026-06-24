using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoastMySite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ScanRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    BusinessType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    TargetAudience = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScanRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ScanReports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ScanRequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    OverallScore = table.Column<int>(type: "integer", nullable: false),
                    SeoScore = table.Column<int>(type: "integer", nullable: false),
                    UxScore = table.Column<int>(type: "integer", nullable: false),
                    PerformanceScore = table.Column<int>(type: "integer", nullable: false),
                    TrustScore = table.Column<int>(type: "integer", nullable: false),
                    CompletenessScore = table.Column<int>(type: "integer", nullable: false),
                    TechScore = table.Column<int>(type: "integer", nullable: false),
                    LegalScore = table.Column<int>(type: "integer", nullable: false),
                    OverallGrade = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    RoastSummary = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    FullReportJson = table.Column<string>(type: "text", nullable: false),
                    IsPaid = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScanReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScanReports_ScanRequests_ScanRequestId",
                        column: x => x.ScanRequestId,
                        principalTable: "ScanRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ScanReports_ScanRequestId",
                table: "ScanReports",
                column: "ScanRequestId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScanReports");

            migrationBuilder.DropTable(
                name: "ScanRequests");
        }
    }
}
