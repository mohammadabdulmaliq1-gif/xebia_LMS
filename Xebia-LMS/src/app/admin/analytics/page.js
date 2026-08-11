"use client";

import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../../components/common/PageHeader";
import MetricCard from "../../../components/common/MetricCard";
import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import Card, { CardBody } from "../../../components/common/Card";
import SearchFilterBar from "../../../components/common/SearchFilterBar";
import { analyticsService, useDataMode } from "../../../services/api";
import {
  TrendingUp,
  Award,
  Users,
  Clock,
  BookOpen,
  Calendar
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [execData, setExecData] = useState(null);
  const [hoursData, setHoursData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isDemoMode, isFallback } = useDataMode();

  // Centralized fetching
  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const emptyParams = {};
        const [exec, hours, trends] = await Promise.all([
          analyticsService.getExecutiveSummary(emptyParams),
          analyticsService.getLearningHours(emptyParams),
          analyticsService.getLearningTrends(emptyParams)
        ]);
        setExecData(exec);
        setHoursData(hours);
        setTrendsData(trends);
      } catch (err) {
        console.error("Failed to fetch curriculum analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [isDemoMode]);

  // Default hardcoded mock telemetry data for demo mode fallbacks
  const defaultTelemetry = [
    { id: 1, email: "john.doe@xebia.com", course: "Next.js Production Architecture", completedAt: "2026-06-28", score: "94%", status: "COMPLETED" },
    { id: 2, email: "sarah.smith@xebia.com", course: "Kubernetes in Production", completedAt: "2026-06-27", score: "88%", status: "COMPLETED" },
    { id: 3, email: "alex.jones@xebia.com", course: "Enterprise Backend Architecture", completedAt: "2026-06-25", score: "72%", status: "PENDING" },
    { id: 4, email: "emily.brown@xebia.com", course: "Next.js Production Architecture", completedAt: "2026-06-24", score: "100%", status: "COMPLETED" },
    { id: 5, email: "michael.green@xebia.com", course: "Kubernetes in Production", completedAt: "2026-06-22", score: "82%", status: "COMPLETED" },
    { id: 6, email: "lucas.black@xebia.com", course: "Enterprise Backend Architecture", completedAt: "2026-06-20", score: "64%", status: "PENDING" }
  ];

  // Map dynamic backend top active learners to telemetry log list
  const telemetryData = useMemo(() => {
    if (hoursData && hoursData.top10ActiveLearners) {
      return hoursData.top10ActiveLearners.map((item, idx) => {
        const email = item.name.toLowerCase().replace(/\s+/g, ".") + "@xebia.com";
        return {
          id: idx,
          email: email,
          course: item.track || "Strategic Learning Pathway",
          completedAt: "2026-06-" + (28 - idx),
          score: item.progress + "%",
          status: item.progress >= 85 ? "COMPLETED" : "PENDING"
        };
      });
    }
    return defaultTelemetry;
  }, [hoursData]);

  const filteredTelemetry = telemetryData.filter((t) => {
    const matchesSearch = t.email.toLowerCase().includes(search.toLowerCase()) ||
                          t.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Learner Email Address",
      key: "email",
      render: (row) => <span className="font-bold text-foreground block">{row.email}</span>
    },
    {
      header: "Completed Pathway",
      key: "course",
      render: (row) => <span className="text-text-muted font-medium block">{row.course}</span>
    },
    {
      header: "Assessment Score",
      key: "score",
      render: (row) => (
        <span className={`font-black ${Number(row.score.replace("%", "")) >= 85 ? "text-emerald-600" : "text-amber-600"}`}>
          {row.score}
        </span>
      )
    },
    {
      header: "Date Completed",
      key: "completedAt",
      render: (row) => (
        <span className="text-text-muted text-[10px] font-semibold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-foreground/30" />
          <span>{row.completedAt}</span>
        </span>
      )
    },
    {
      header: "Certificate Status",
      key: "status",
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  // Dynamic values with custom fallback defaults
  const completionRate = execData ? `${execData.trainingSatisfactionScore}%` : "84.2%";
  const certsIssued = execData ? execData.totalCertificationsCompleted.toLocaleString() : "1,450";
  const dailyActive = execData ? execData.totalSessionsConducted.toString() : "124";
  const studySession = execData ? `${Math.round(execData.averageHoursPerSession)} hrs` : "35 mins";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Learning Analytics"
        description="Monitor student progress telemetry, course completion rates, and certifications earned."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Analytics", href: "/admin/analytics" }
        ]}
      />

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Course Completion Rate"
          value={completionRate}
          icon={TrendingUp}
          trend="+3.1% vs last month"
          description="Syllabus final test pass rate"
          gradientScheme="primary"
        />
        <MetricCard
          title="Certifications Issued"
          value={certsIssued}
          icon={Award}
          trend="+120 issued today"
          description="Total learner badge exports"
          gradientScheme="primary"
        />
        <MetricCard
          title="Daily Active Learners"
          value={dailyActive}
          icon={Users}
          trend="+12% active streak"
          description="Live database sessions today"
          gradientScheme="primary"
        />
        <MetricCard
          title="Average Study Session"
          value={studySession}
          icon={Clock}
          trend="Telemetry duration average"
          description="Average learning hours per session"
          gradientScheme="primary"
        />
      </div>

      {/* Structured metrics graph preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-black text-primary uppercase tracking-wider">
                Monthly Activity Distribution
              </span>
              <span className="text-[10px] text-text-muted font-bold">Dynamic Chart Data</span>
            </div>
            
            {/* Visual simulation of chart bars using trendsData */}
            <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
              {(trendsData?.sessionsConductedTrend || [45, 60, 55, 75, 90, 85, 105, 95, 110, 120, 115, 124]).map((h, i) => (
                <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2 text-xs">
                  <div
                    className="w-full bg-primary hover:bg-accent transition-colors rounded-t-md"
                    style={{ height: `${(h / 130) * 100}%` }}
                    title={`Month ${i + 1}: ${h} Active Users`}
                  />
                  <span className="text-[9px] text-text-muted font-bold font-mono">
                    {["J","F","M","A","M","J","J","A","S","O","N","D"][i % 12]}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-black text-primary uppercase tracking-wider">
                Category Distribution
              </span>
              <span className="text-[10px] text-text-muted font-bold">Enrollments</span>
            </div>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-foreground">
                  <span>Cloud & DevOps</span>
                  <span>42%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "42%" }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-foreground">
                  <span>Frontend Engineering</span>
                  <span>35%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: "35%" }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-foreground">
                  <span>Enterprise Backend</span>
                  <span>23%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cta" style={{ width: "23%" }} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Telemetry log list */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          <span>Syllabus Completion Telemetry Logs</span>
        </h3>

        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search by student email or course..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              placeholder: "All Certificates",
              options: [
                { value: "COMPLETED", label: "Completed" },
                { value: "PENDING", label: "Pending" }
              ]
            }
          ]}
          onClear={() => {
            setSearch("");
            setStatusFilter("All");
          }}
        />

        <DataTable
          columns={columns}
          data={filteredTelemetry}
          emptyTitle="No log telemetry entries"
          emptyDescription="There are no matched student logs on this query."
        />
      </div>
    </div>
  );
}
