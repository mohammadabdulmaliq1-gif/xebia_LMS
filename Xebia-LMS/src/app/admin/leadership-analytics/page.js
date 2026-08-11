"use client";

import React, { useState, useMemo, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import MetricCard from "../../../components/common/MetricCard";
import Card, { CardBody } from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import { analyticsService } from "../../../services/api";
import {
  TrendingUp,
  Award,
  Users,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
  Percent,
  Search,
  RefreshCw,
  Layout,
  Target,
  LineChart,
  ThumbsUp,
  Shield,
  FileCode,
  ArrowRight,
  TrendingDown,
  Activity,
  Flame,
  AwardIcon
} from "lucide-react";

// List of filter options
const YEARS = ["All", "2026", "2025", "2024"];
const QUARTERS = ["All", "Q1", "Q2", "Q3", "Q4"];
const HALF_YEARS = ["All", "H1", "H2"];
const MONTHS = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const REGIONS = ["All", "India", "USA", "UK", "Netherlands", "Middle East"];
const LOCATIONS = ["All", "Gurugram", "Bengaluru", "Noida", "Atlanta", "London", "Amsterdam", "Dubai"];
const BUS = ["All", "Cloud Engineering", "Data & AI", "Software Engineering", "Agile & Devops", "Salesforce"];
const DEPARTMENTS = ["All", "Digital Solutions", "Data Science", "Platform Ops", "Security Practice", "Advisory Services"];
const PROJECTS = ["All", "Project Alpha", "Project Orion", "Project Sirius", "Project Polaris", "Project Zenith"];
const PRACTICES = ["All", "Microsoft Azure", "AWS", "Google Cloud", "Databricks", "Snowflake", "Generative AI"];
const GRADES = ["All", "Principal Consultant", "Senior Consultant", "Consultant", "Associate Consultant", "Tech Lead"];

export default function LeadershipAnalyticsPage() {
  // Global filter state
  const [filters, setFilters] = useState({
    year: "All",
    quarter: "All",
    halfYear: "All",
    month: "All",
    region: "All",
    location: "All",
    bu: "All",
    dept: "All",
    project: "All",
    practice: "All",
    grade: "All",
    employee: "",
    startDate: "",
    endDate: ""
  });

  const [activeTab, setActiveTab] = useState("executive");
  const [trendView, setTrendView] = useState("QoQ"); // QoQ, MoM, YoY tabs for trends

  // Backend integration state
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let data = null;
        const apiParams = {
          year: filters.year,
          quarter: filters.quarter,
          halfYear: filters.halfYear,
          month: filters.month,
          startDate: filters.startDate,
          endDate: filters.endDate,
          region: filters.region,
          location: filters.location,
          businessUnit: filters.bu,
          department: filters.dept,
          project: filters.project,
          practice: filters.practice,
          employeeGrade: filters.grade,
          employeeId: filters.employee
        };

        if (activeTab === "executive") {
          data = await analyticsService.getExecutiveSummary(apiParams);
        } else if (activeTab === "coverage") {
          data = await analyticsService.getLearningCoverage(apiParams);
        } else if (activeTab === "hours") {
          data = await analyticsService.getLearningHours(apiParams);
        } else if (activeTab === "pillars") {
          data = await analyticsService.getLearningPillars(apiParams);
        } else if (activeTab === "ai") {
          data = await analyticsService.getAITransformation(apiParams);
        } else if (activeTab === "certs") {
          data = await analyticsService.getCertifications(apiParams);
        } else if (activeTab === "flagship") {
          data = await analyticsService.getFlagshipPrograms(apiParams);
        } else if (activeTab === "trends") {
          const trends = await analyticsService.getLearningTrends(apiParams);
          const eff = await analyticsService.getTrainingEffectiveness(apiParams);
          if (trends || eff) {
            data = { ...trends, ...eff };
          }
        } else if (activeTab === "champions") {
          const champs = await analyticsService.getLearningChampions(apiParams);
          const invest = await analyticsService.getProjectInvestment(apiParams);
          if (champs || invest) {
            data = { ...champs, projectInvestment: invest };
          }
        } else if (activeTab === "freshers") {
          data = await analyticsService.getFresherJourney(apiParams);
        } else if (activeTab === "future") {
          const gap = await analyticsService.getSkillGap(apiParams);
          const recs = await analyticsService.getRecommendations(apiParams);
          const pred = await analyticsService.getPredictiveInsights(apiParams);
          if (gap || recs || pred) {
            data = { ...gap, ...recs, ...pred };
          }
        }
        setApiData(data);
      } catch (err) {
        console.error("Failed to load backend analytics data:", err);
        setApiData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeTab, filters]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      year: "All",
      quarter: "All",
      halfYear: "All",
      month: "All",
      region: "All",
      location: "All",
      bu: "All",
      dept: "All",
      project: "All",
      practice: "All",
      grade: "All",
      employee: "",
      startDate: "",
      endDate: ""
    });
  };

  // Helper factor for local scaling fallback calculations
  const filterFactor = useMemo(() => {
    let factor = 1.0;
    if (filters.year !== "All") factor *= 0.6;
    if (filters.quarter !== "All") factor *= 0.3;
    if (filters.halfYear !== "All") factor *= 0.52;
    if (filters.month !== "All") factor *= 0.12;
    if (filters.region !== "All") factor *= 0.45;
    if (filters.location !== "All") factor *= 0.32;
    if (filters.bu !== "All") factor *= 0.38;
    if (filters.dept !== "All") factor *= 0.28;
    if (filters.project !== "All") factor *= 0.15;
    if (filters.practice !== "All") factor *= 0.22;
    if (filters.grade !== "All") factor *= 0.26;
    if (filters.employee) factor *= 0.02;
    if (filters.startDate && filters.endDate) factor *= 0.4;
    return Math.max(factor, 0.01);
  }, [filters]);

  const dataSeed = useMemo(() => {
    let sum = 0;
    const filterString = Object.values(filters).join("");
    for (let i = 0; i < filterString.length; i++) {
      sum += filterString.charCodeAt(i);
    }
    return sum || 100;
  }, [filters]);

  const pseudoRandom = (min, max, offset = 0) => {
    const val = Math.sin(dataSeed + offset) * 10000;
    const rnd = val - Math.floor(val);
    return Math.floor(rnd * (max - min + 1) + min);
  };

  // Local fallback calculation engine
  const kpis = useMemo(() => {
    const totalEmployees = Math.max(Math.round(2500 * (filters.region !== "All" ? 0.35 : 1) * (filters.dept !== "All" ? 0.25 : 1)), 50);
    const nominated = Math.round(totalEmployees * (0.8 + (pseudoRandom(1, 10, 2) / 100)));
    const trained = Math.round(nominated * (0.65 + (pseudoRandom(1, 15, 1) / 100)));
    const coveragePercent = ((trained / totalEmployees) * 100).toFixed(1);

    const sessions = Math.round(120 * filterFactor + pseudoRandom(1, 10, 3));
    const attendees = Math.round(trained * 1.4);
    const nominations = Math.round(nominated * 1.25);
    const learningHours = Math.round(attendees * 2.5);
    const avgHoursPerSession = (learningHours / sessions).toFixed(1);

    const certsCompleted = Math.round(350 * filterFactor + pseudoRandom(1, 30, 4));
    const certGrowth = (12.4 + (pseudoRandom(-5, 10, 5) / 10)).toFixed(1);

    const aiTrained = Math.round(trained * 0.42);
    const aiCerts = Math.round(certsCompleted * 0.38);
    const aiLearningHours = Math.round(learningHours * 0.45);
    const aiSessions = Math.round(sessions * 0.4);
    const aiAttendancePct = Math.round(86 + pseudoRandom(-4, 10, 9));

    const avgFeedback = (4.5 + (pseudoRandom(-3, 4, 6) / 10)).toFixed(2);
    const satScore = Math.round(85 + pseudoRandom(-5, 10, 7));
    const recommendPercent = Math.round(88 + pseudoRandom(-4, 10, 8));

    return {
      totalEmployees,
      nominated,
      trained,
      coveragePercent,
      sessions,
      attendees,
      nominations,
      learningHours,
      avgHoursPerSession,
      certsCompleted,
      certGrowth,
      aiTrained,
      aiCerts,
      aiLearningHours,
      aiSessions,
      aiAttendancePct,
      avgFeedback,
      satScore,
      recommendPercent
    };
  }, [filterFactor, filters, dataSeed]);

  // Integrated KPI overlay (prefers backend apiData over local fallback)
  const executiveMetrics = useMemo(() => {
    if (apiData && activeTab === "executive") {
      return {
        totalEmployees: apiData.totalEmployees,
        nominated: apiData.employeesNominated,
        trained: apiData.employeesTrained,
        coveragePercent: apiData.learningCoveragePercentage,
        sessions: apiData.totalSessionsConducted,
        attendees: apiData.totalAttendees,
        nominations: apiData.totalNominations,
        learningHours: apiData.totalLearningHours,
        avgHoursPerSession: apiData.averageHoursPerSession,
        certsCompleted: apiData.totalCertificationsCompleted,
        certGrowth: apiData.certificationGrowthPercentage,
        aiTrained: apiData.employeesTrainedInAI,
        aiCerts: apiData.aiCertificationsAchieved,
        aiLearningHours: apiData.aiLearningHours,
        avgFeedback: apiData.averageFeedbackRating,
        satScore: apiData.trainingSatisfactionScore,
        recommendPercent: apiData.recommendationPercentage
      };
    }
    return kpis;
  }, [apiData, kpis, activeTab]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leadership Learning Analytics Dashboard"
        description="Global learning reach, capability matrices, Zoho certifications, and AI transformation metrics."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Leadership Analytics", href: "/admin/leadership-analytics" }
        ]}
      />

      {/* FILTER CONTROL BAR */}
      <Card className="border border-border/80 shadow-xs bg-white rounded-2xl overflow-hidden">
        <CardBody className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent" />
              <span>Global Enterprise Filters {loading && <span className="normal-case text-[10px] text-text-muted font-normal animate-pulse">(syncing with backend...)</span>}</span>
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={resetFilters}
              className="flex items-center gap-1 hover:bg-gray-150 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Year-wise</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Quarter-wise</label>
              <select
                value={filters.quarter}
                onChange={(e) => setFilters({ ...filters, quarter: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Half-Yearly</label>
              <select
                value={filters.halfYear}
                onChange={(e) => setFilters({ ...filters, halfYear: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {HALF_YEARS.map((hy) => <option key={hy} value={hy}>{hy}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Monthly</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Region</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Business Unit</label>
              <select
                value={filters.bu}
                onChange={(e) => setFilters({ ...filters, bu: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {BUS.map((bu) => <option key={bu} value={bu}>{bu}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Department</label>
              <select
                value={filters.dept}
                onChange={(e) => setFilters({ ...filters, dept: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Project</label>
              <select
                value={filters.project}
                onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Practice</label>
              <select
                value={filters.practice}
                onChange={(e) => setFilters({ ...filters, practice: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {PRACTICES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Employee Grade</label>
              <select
                value={filters.grade}
                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              >
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Individual Employee</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ID or Name..."
                  value={filters.employee}
                  onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
                  className="w-full p-2 pr-7 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
                />
                <Search className="w-3.5 h-3.5 absolute right-2 top-2.5 text-foreground/40" />
              </div>
            </div>

            <div className="space-y-1 col-span-1 md:col-span-2 lg:col-span-3">
              <label className="font-bold text-foreground">Custom Date Range (Start Date)</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              />
            </div>

            <div className="space-y-1 col-span-1 md:col-span-2 lg:col-span-3">
              <label className="font-bold text-foreground">Custom Date Range (End Date)</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 text-xs"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* STICKY TABS MENU */}
      <div className="flex border-b border-border overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200">
        {[
          { id: "executive", label: "Executive Summary" },
          { id: "coverage", label: "Coverage & Participation" },
          { id: "hours", label: "Learning Hours" },
          { id: "pillars", label: "Learning Pillars" },
          { id: "ai", label: "AI Transformation" },
          { id: "certs", label: "Zoho Certifications" },
          { id: "flagship", label: "Flagship Programs" },
          { id: "trends", label: "Trends & Effectiveness" },
          { id: "champions", label: "Champions & Investment" },
          { id: "freshers", label: "Campus Journey" },
          { id: "future", label: "Future Roadmap" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setApiData(null); }}
            className={`py-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-primary bg-primary/5 font-extrabold"
                : "border-transparent text-text-muted hover:text-foreground hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD RENDER AREA */}
      <div className="space-y-6">
        {/* T1: EXECUTIVE SUMMARY */}
        {activeTab === "executive" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Learning Reach */}
              <MetricCard
                title="Total Employees"
                value={executiveMetrics.totalEmployees.toLocaleString()}
                icon={Users}
                description="Total enterprise headcount"
                gradientScheme="primary"
              />
              <MetricCard
                title="Employees Nominated"
                value={executiveMetrics.nominated.toLocaleString()}
                icon={Award}
                description="Nominated for skill programs"
                gradientScheme="primary"
              />
              <MetricCard
                title="Employees Trained"
                value={executiveMetrics.trained.toLocaleString()}
                icon={CheckCircle2}
                description="Completed learning paths"
                gradientScheme="primary"
              />
              <div className="bg-white border border-border/80 shadow-xs rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-text-muted text-[10px] font-bold uppercase tracking-wider">
                    <span>Learning Coverage %</span>
                    <Percent className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-2xl font-black text-foreground mt-2 block">{executiveMetrics.coveragePercent}%</span>
                  <div className="h-2 bg-gray-150 rounded-full overflow-hidden mt-3.5">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${executiveMetrics.coveragePercent}%` }} />
                  </div>
                </div>
                <span className="text-[10px] text-text-muted font-bold mt-3 block">
                  Formula: Trained / Headcount × 100
                </span>
              </div>

              {/* Learning Delivery */}
              <MetricCard
                title="Total Sessions Conducted"
                value={executiveMetrics.sessions.toString()}
                icon={Calendar}
                description="Live expert sessions conducted"
                gradientScheme="primary"
              />
              <MetricCard
                title="Total Attendees"
                value={executiveMetrics.attendees.toLocaleString()}
                icon={Users}
                description="Sum total of attendance instances"
                gradientScheme="primary"
              />
              <MetricCard
                title="Total Nominations"
                value={executiveMetrics.nominations.toLocaleString()}
                icon={Award}
                description="Registrations processed"
                gradientScheme="primary"
              />
              <MetricCard
                title="Total Learning Hours"
                value={executiveMetrics.learningHours.toLocaleString()}
                icon={Clock}
                description="Total learning exposure logged"
                gradientScheme="primary"
              />
              <MetricCard
                title="Average Hours per Session"
                value={`${executiveMetrics.avgHoursPerSession} hrs`}
                icon={Clock}
                description="Avg session duration telemetry"
                gradientScheme="primary"
              />

              {/* Certification Summary */}
              <MetricCard
                title="Total Certifications Completed"
                value={executiveMetrics.certsCompleted.toString()}
                icon={Award}
                description="Total completed cert badges"
                gradientScheme="primary"
              />
              <MetricCard
                title="Certification Growth %"
                value={`+${executiveMetrics.certGrowth}%`}
                icon={TrendingUp}
                description="YoY certification completed growth"
                gradientScheme="primary"
              />

              {/* AI Readiness Summary */}
              <MetricCard
                title="Employees Trained in AI"
                value={executiveMetrics.aiTrained.toString()}
                icon={Sparkles}
                description="Trained in AI Pillars"
                gradientScheme="primary"
              />
              <MetricCard
                title="AI Certifications Achieved"
                value={executiveMetrics.aiCerts.toString()}
                icon={Award}
                description="Databricks, Kiro & internal AI certs"
                gradientScheme="primary"
              />
              <MetricCard
                title="AI Learning Hours"
                value={executiveMetrics.aiLearningHours.toLocaleString()}
                icon={Clock}
                description="Dedicated GenAI skills hours"
                gradientScheme="primary"
              />

              {/* Training Effectiveness */}
              <MetricCard
                title="Average Feedback Rating"
                value={`${executiveMetrics.avgFeedback} / 5.0`}
                icon={ThumbsUp}
                description="Attendee evaluation score average"
                gradientScheme="primary"
              />
              <MetricCard
                title="Training Satisfaction Score"
                value={`${executiveMetrics.satScore}%`}
                icon={Percent}
                description="Overall CSAT rating index"
                gradientScheme="primary"
              />
              <MetricCard
                title="Recommendation %"
                value={`${executiveMetrics.recommendPercent}%`}
                icon={ThumbsUp}
                description="Attendees recommending the program"
                gradientScheme="primary"
              />
            </div>
          </div>
        )}

        {/* T2: LEARNING COVERAGE & PARTICIPATION */}
        {activeTab === "coverage" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            {/* Breakout list */}
            <Card>
              <CardBody className="p-6 space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                  Learning Coverage Metrics Breakout
                </span>
                <div className="space-y-4.5">
                  {(apiData?.coverageByRegion || [
                    { region: "India Region", percentage: 92 },
                    { region: "USA Region", percentage: 64 },
                    { region: "UK Region", percentage: 58 },
                    { region: "Netherlands Region", percentage: 82 },
                    { region: "Middle East Region", percentage: 45 }
                  ]).map((item, idx) => {
                    const label = item.region || item.label;
                    const pct = item.percentage;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-extrabold text-foreground">
                          <span>{label}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* Coverage Heatmap */}
            <Card>
              <CardBody className="p-6 space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                  Coverage Heatmap
                </span>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {(apiData?.coverageHeatmap || [
                    { name: "Gurugram", pct: 88 },
                    { name: "Bengaluru", pct: 92 },
                    { name: "Noida", pct: 75 },
                    { name: "Atlanta", pct: 64 },
                    { name: "London", pct: 58 },
                    { name: "Amsterdam", pct: 82 },
                    { name: "Dubai", pct: 45 },
                    { name: "Pune", pct: 79 },
                    { name: "Sales US", pct: 38 }
                  ]).map((cell, idx) => {
                    let colorClass = "bg-emerald-600 text-white";
                    if (cell.pct < 50) colorClass = "bg-rose-500 text-white";
                    else if (cell.pct < 75) colorClass = "bg-amber-500 text-white";
                    else if (cell.pct >= 90) colorClass = "bg-emerald-700 text-white";
                    return (
                      <div key={idx} className={`p-4 rounded-xl flex flex-col justify-between h-24 ${colorClass} shadow-xs`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{cell.name}</span>
                        <span className="text-lg font-black">{cell.pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* Region Chart & Project wise */}
            <Card className="lg:col-span-2">
              <CardBody className="p-6 space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                  Learning Coverage & Participation Visualizations
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                  {/* Region wise bar chart */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground">Region-wise Coverage Chart</h4>
                    <div className="h-44 flex items-end justify-between gap-4 border-b border-border pb-2 px-2">
                      {(apiData?.regionWiseCoverageChart || [
                        { name: "India", value: 92 },
                        { name: "USA", value: 64 },
                        { name: "UK", value: 58 },
                        { name: "NL", value: 82 },
                        { name: "M.East", value: 45 }
                      ]).map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="text-[9px] font-bold text-accent font-mono">{bar.value}%</div>
                          <div
                            className="w-full bg-accent hover:bg-primary transition-all rounded-t-md"
                            style={{ height: `${(bar.value / 100) * 120}px` }}
                          />
                          <span className="text-[9px] text-text-muted font-bold truncate max-w-full">
                            {bar.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project wise bar chart */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground">Project-wise Participation Chart</h4>
                    <div className="h-44 flex items-end justify-between gap-4 border-b border-border pb-2 px-2">
                      {(apiData?.projectWiseParticipationChart || [
                        { name: "Proj Alpha", value: 78 },
                        { name: "Proj Orion", value: 92 },
                        { name: "Proj Sirius", value: 54 },
                        { name: "Proj Polaris", value: 88 },
                        { name: "Proj Zenith", value: 62 }
                      ]).map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="text-[9px] font-bold text-primary font-mono">{bar.value}</div>
                          <div
                            className="w-full bg-primary hover:bg-accent transition-all rounded-t-md"
                            style={{ height: `${(bar.value / 100) * 120}px` }}
                          />
                          <span className="text-[9px] text-text-muted font-bold truncate max-w-full">
                            {bar.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quarterly line chart */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground">Quarterly Participation Trend</h4>
                    <div className="relative h-44 border-b border-l border-border px-2">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="var(--color-primary, #ED1C24)"
                          strokeWidth="3.5"
                          points="5,80 30,55 60,30 95,12"
                        />
                        <circle cx="5" cy="80" r="3" fill="var(--color-accent, #00AEEF)" />
                        <circle cx="30" cy="55" r="3" fill="var(--color-accent, #00AEEF)" />
                        <circle cx="60" cy="30" r="3" fill="var(--color-accent, #00AEEF)" />
                        <circle cx="95" cy="12" r="3" fill="var(--color-accent, #00AEEF)" />
                      </svg>
                      <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 text-[9px] text-text-muted font-bold font-mono">
                        <span>Q1 2025</span>
                        <span>Q2 2025</span>
                        <span>Q3 2025</span>
                        <span>Q4 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* T3: LEARNING HOURS ANALYTICS */}
        {activeTab === "hours" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hours KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Learning Hours"
                value={(apiData?.totalLearningHours || kpis.learningHours).toLocaleString()}
                icon={Clock}
                description="Total organization hours spent"
                gradientScheme="primary"
              />
              <MetricCard
                title="Avg Hours per Employee"
                value={apiData?.averageLearningHoursPerEmployee || (kpis.learningHours / kpis.totalEmployees).toFixed(1)}
                icon={Clock}
                description="Hours per employee headcount"
                gradientScheme="primary"
              />
              <MetricCard
                title="Avg Hours per Active Learner"
                value={apiData?.averageLearningHoursPerActiveLearner || (kpis.learningHours / kpis.trained).toFixed(1)}
                icon={Clock}
                description="Hours per active trained learner"
                gradientScheme="primary"
              />
              <MetricCard
                title="Highest Avg Hours by Region"
                value="28.4 hrs"
                icon={MapPin}
                description="Top region learning average"
                gradientScheme="primary"
              />
            </div>

            {/* Top 10 lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Projects & Regions */}
              <Card className="lg:col-span-2">
                <CardBody className="p-6 space-y-6">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    Learning Hours Additional Insights (Top 10 lists)
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top 10 regions */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>Top 10 Learning-Focused Regions (Average Hours)</span>
                      </h4>
                      <div className="divide-y divide-border text-xs">
                        {(apiData?.top10LearningFocusedRegions || [
                          { name: "Bengaluru (India)", value: 28 },
                          { name: "Gurugram (India)", value: 26 },
                          { name: "Amsterdam (NL)", value: 24 },
                          { name: "Noida (India)", value: 22 },
                          { name: "Atlanta (USA)", value: 20 },
                          { name: "London (UK)", value: 18 },
                          { name: "Dubai (ME)", value: 15 },
                          { name: "Singapore (APAC)", value: 14 },
                          { name: "Pune (India)", value: 14 },
                          { name: "Riyadh (KSA)", value: 12 }
                        ]).map((item, idx) => (
                          <div key={idx} className="flex justify-between py-2 items-center">
                            <span className="font-bold">{idx + 1}. {item.name || item.region}</span>
                            <span className="text-text-muted font-mono">{item.value || item.hours} hrs</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top 10 Projects */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-accent" />
                        <span>Top 10 Learning-Focused Projects (Average Hours)</span>
                      </h4>
                      <div className="divide-y divide-border text-xs">
                        {(apiData?.top10LearningFocusedProjects || [
                          { name: "Project Alpha", value: 48 },
                          { name: "Project Orion", value: 45 },
                          { name: "Project Sirius", value: 42 },
                          { name: "Project Polaris", value: 38 },
                          { name: "Project Zenith", value: 35 },
                          { name: "Project Delta", value: 32 },
                          { name: "Project Apex", value: 28 },
                          { name: "Project Titan", value: 26 },
                          { name: "Project Helix", value: 24 },
                          { name: "Project Omega", value: 22 }
                        ]).map((item, idx) => (
                          <div key={idx} className="flex justify-between py-2 items-center">
                            <span className="font-bold">{idx + 1}. {item.name || item.project}</span>
                            <span className="text-text-muted font-mono">{item.value || item.hours} hrs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Top 10 active learners */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    Top 10 Active Learners
                  </span>
                  <div className="divide-y divide-border text-xs">
                    {(apiData?.top10ActiveLearners || [
                      { name: "Priyanka Sharma", hours: 48, progress: 95, track: "Next.js" },
                      { name: "Amit Patel", hours: 42, progress: 80, track: "Kubernetes" },
                      { name: "Rachel Green", hours: 38, progress: 65, track: "Spring Boot" },
                      { name: "John Doe", hours: 35, progress: 100, track: "Compliance" },
                      { name: "Alex Jones", hours: 32, progress: 75, track: "AWS Cloud" },
                      { name: "Siddharth Verma", hours: 30, progress: 92, track: "Databricks" },
                      { name: "Emily Brown", hours: 28, progress: 88, track: "Generative AI" },
                      { name: "Michael Green", hours: 26, progress: 82, track: "GCP Basics" },
                      { name: "Lucas Black", hours: 24, progress: 60, track: "Snowflake" },
                      { name: "Sarah Smith", hours: 22, progress: 70, track: "Agile Scrum" }
                    ]).map((item, idx) => (
                      <div key={idx} className="py-2.5 space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{idx + 1}. {item.name}</span>
                          <span className="text-text-muted font-mono">{item.hours} hrs ({item.track})</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* T4: TRAINING CATEGORIES / LEARNING PILLARS */}
        {activeTab === "pillars" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "1. Compliance Learning",
                  desc: "Essential regulatory compliance and legal awareness paths mandated across Xebia.",
                  examples: "POSH, PISMS, Security Awareness, Mandatory Compliance Programs",
                  hours: 850,
                  certs: 240,
                  icon: Shield
                },
                {
                  title: "2. Technical Learning",
                  desc: "Core backend, database, and cloud engineering training tracks designed by Architects.",
                  examples: "Databricks, Cloud, Data Engineering, Development Technologies",
                  hours: 2950,
                  certs: 380,
                  icon: FileCode
                },
                {
                  title: "3. AI & GenAI Learning",
                  desc: "Advanced prompt engineering, local LLMs, and developer productivity tooling.",
                  examples: "Kiro, Claude, Copilot, GenAI Learning Paths, AI Workshops",
                  hours: 4200,
                  certs: 490,
                  icon: Sparkles
                },
                {
                  title: "4. Leadership Development",
                  desc: "Nurturing executive managers, project leaders, and team architects.",
                  examples: "YMP (Young Managers Program), Managerial Programs, People Management Programs",
                  hours: 640,
                  certs: 45,
                  icon: Layout
                },
                {
                  title: "5. Upskilling & Cross-Skilling",
                  desc: "Facilitating internal mobility and platform shifts for engineers.",
                  examples: "Solution Architect Programs, Tech Lead Development, Career Transition Paths",
                  hours: 1150,
                  certs: 88,
                  icon: Layers
                },
                {
                  title: "6. Certifications",
                  desc: "Tracking validation of skills through external technology vendor certifications.",
                  examples: "Databricks, AWS, Google Cloud, Azure, Snowflake, PMP",
                  hours: 3200,
                  certs: kpis.certsCompleted,
                  icon: Award
                },
                {
                  title: "7. Flagship Programs",
                  desc: "Strategic organizational shifts aligned with global core initiatives.",
                  examples: "Quantum Shift, Tech AI Thon, Databricks strategic certification drives",
                  hours: 1850,
                  certs: 120,
                  icon: Target
                }
              ].map((pillar, idx) => {
                // If apiData is loaded from backend, overlay the calculated numbers
                let displayHours = pillar.hours;
                let displayParticipants = 25;
                if (apiData && Array.isArray(apiData)) {
                  const apiPillar = apiData.find(ap => ap.pillarName?.toLowerCase().includes(pillar.title.substring(3).toLowerCase().trim()));
                  if (apiPillar) {
                    displayHours = apiPillar.learningHours;
                    displayParticipants = apiPillar.totalParticipants;
                  }
                }
                return (
                  <Card key={idx} className="hoverable border border-border/80 flex flex-col justify-between" hoverable>
                    <CardBody className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-black text-primary leading-tight">{pillar.title}</h3>
                        <div className="p-2 bg-primary/5 rounded-lg text-primary">
                          <pillar.icon className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed">{pillar.desc}</p>
                      <div className="bg-gray-50 border border-border/50 rounded-xl p-3.5 space-y-2.5">
                        <span className="text-[10px] text-text-muted uppercase font-black tracking-wider block">
                          Included Tracks
                        </span>
                        <p className="text-[11px] font-bold text-foreground leading-snug">{pillar.examples}</p>
                      </div>
                    </CardBody>
                    <div className="bg-gray-50/50 border-t border-border px-6 py-3.5 flex justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider">
                      <span>{displayHours.toLocaleString()} hours</span>
                      <span>{displayParticipants} participants</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* T5: AI TRANSFORMATION DASHBOARD */}
        {activeTab === "ai" && (
          <div className="space-y-6 animate-fadeIn">
            {/* AI Readiness Index */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <MetricCard
                title="Employees Trained on AI"
                value={(apiData?.employeesTrainedOnAI || kpis.aiTrained).toString()}
                icon={Sparkles}
                description="Completed AI Capability paths"
                gradientScheme="primary"
              />
              <MetricCard
                title="Employees Certified on AI"
                value={(apiData?.employeesCertifiedOnAI || kpis.aiCerts).toString()}
                icon={Award}
                description="AI credentials achieved"
                gradientScheme="primary"
              />
              <MetricCard
                title="AI Learning Hours"
                value={(apiData?.aiLearningHours || kpis.aiLearningHours).toLocaleString()}
                icon={Clock}
                description="Total AI study hours logged"
                gradientScheme="primary"
              />
              <MetricCard
                title="AI Sessions Conducted"
                value={(apiData?.aiSessionsConducted || kpis.aiSessions).toString()}
                icon={Calendar}
                description="AI courses & workshops run"
                gradientScheme="primary"
              />
              <MetricCard
                title="AI Training Attendance %"
                value={`${apiData?.aiTrainingAttendancePercentage || kpis.aiAttendancePct}%`}
                icon={Percent}
                description="Average attendee sync rate"
                gradientScheme="primary"
              />
            </div>

            {/* AI Funnel & tools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funnel */}
              <Card className="lg:col-span-2">
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    AI Adoption Funnel
                  </span>
                  <div className="space-y-3 pt-3">
                    {(apiData?.aiAdoptionFunnel || [
                      { name: "Registered", count: 980, percentage: 100 },
                      { name: "Attended", count: 750, percentage: 76 },
                      { name: "Completed Learning", count: 480, percentage: 49 },
                      { name: "Certified", count: 180, percentage: 18 },
                      { name: "Using AI Tools", count: 95, percentage: 9 }
                    ]).map((step, idx) => {
                      const pct = step.percentage || step.pct;
                      const widthVal = pct === 100 ? "w-full" : pct > 75 ? "w-11/12" : pct > 40 ? "w-8/12" : pct > 15 ? "w-5/12" : "w-3/12";
                      return (
                        <div key={idx} className="flex items-center gap-4 text-xs">
                          <span className="w-40 font-bold text-foreground text-right">{step.name}</span>
                          <div className="flex-1">
                            <div className={`h-8 bg-primary/90 ${widthVal} rounded-r-lg flex items-center justify-between px-3 text-white font-extrabold shadow-sm`}>
                              <span>{step.count}</span>
                              <span>{pct}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Tools adoption & AI Champions */}
              <Card>
                <CardBody className="p-6 space-y-5">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    AI Tools Adoption & Champions
                  </span>
                  <div className="space-y-3">
                    {Object.entries(apiData?.aiToolsAdoption || {
                      "Copilot Users": 640,
                      "Kiro Users": 420,
                      "Claude Users": 185,
                      "Other Platform Users": 92
                    }).map(([toolName, val], idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <span className="font-semibold">{toolName}</span>
                        <span className="font-extrabold text-foreground font-mono">{String(val)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 border border-border/50 rounded-xl p-3.5 space-y-2.5">
                    <span className="text-[10px] text-text-muted uppercase font-black tracking-wider block">
                      AI Champions Network
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white border border-border p-2 rounded-lg">
                        <span className="block font-black text-primary">{apiData?.aiChampions?.["AI Power Users"] || 24}</span>
                        <span className="text-[9px] font-bold text-text-muted">AI Power Users</span>
                      </div>
                      <div className="bg-white border border-border p-2 rounded-lg">
                        <span className="block font-black text-accent">{apiData?.aiChampions?.["AI Mentors"] || 12}</span>
                        <span className="text-[9px] font-bold text-text-muted">AI Mentors</span>
                      </div>
                      <div className="bg-white border border-border p-2 rounded-lg">
                        <span className="block font-black text-cta">{apiData?.aiChampions?.["AI Ambassadors"] || 8}</span>
                        <span className="text-[9px] font-bold text-text-muted">Ambassadors</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Heatmap & Maturity Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Heatmap */}
              <Card className="lg:col-span-2">
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    AI Capability Heatmap (Readiness Scores)
                  </span>
                  <div className="grid grid-cols-4 gap-3 text-center text-xs">
                    {(apiData?.aiCapabilityHeatmap || [
                      { name: "India Center", pct: 92 },
                      { name: "USA/UK Center", pct: 64 },
                      { name: "Data Science", pct: 96 },
                      { name: "Consulting", pct: 58 },
                      { name: "Project Alpha", pct: 85 },
                      { name: "Project Polaris", pct: 54 },
                      { name: "Generative AI", pct: 98 },
                      { name: "Salesforce Practice", pct: 42 }
                    ]).map((cell, idx) => {
                      let color = "bg-emerald-500 text-white";
                      if (cell.pct < 50) color = "bg-rose-500 text-white";
                      else if (cell.pct < 75) color = "bg-amber-500 text-white";
                      return (
                        <div key={idx} className={`p-3 rounded-xl flex flex-col justify-between h-20 ${color}`}>
                          <span className="text-[8px] font-black uppercase tracking-wider block opacity-80">Telemetry</span>
                          <span className="text-[10px] font-bold leading-tight block">{cell.name}</span>
                          <span className="text-base font-black block mt-0.5">{cell.pct || cell.val}/100</span>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Maturity Score info */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    AI Maturity Scorecard
                  </span>
                  
                  <div className="bg-gradient-to-br from-primary-dark via-primary to-secondary text-white p-5 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-accent/20 to-transparent blur-2xl" />
                    <span className="text-[10px] uppercase font-black tracking-wider block text-white/70">Maturity Rating</span>
                    <h3 className="text-3xl font-black">{apiData?.aiMaturityScore || 76} / 100</h3>
                    <p className="text-[10px] text-white/90 leading-relaxed">
                      Calculated from a weighted index combining training completion (40%), certification (30%), daily tool adoption (20%), and learning hours (10%).
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* T6: ZOHO CERTIFICATIONS */}
        {activeTab === "certs" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Certifications KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Certifications"
                value={(apiData?.totalCertifications || kpis.certsCompleted).toString()}
                icon={Award}
                description="Synced with Zoho database"
                gradientScheme="primary"
              />
              <MetricCard
                title="Approved in Zoho"
                value={Math.round((apiData?.totalCertifications || kpis.certsCompleted) * 0.9).toString()}
                icon={CheckCircle2}
                description="Approved Zoho credentials sync"
                gradientScheme="primary"
              />
              <MetricCard
                title="Pending Approval"
                value={Math.round((apiData?.totalCertifications || kpis.certsCompleted) * 0.1).toString()}
                icon={Clock}
                description="Submitted Zoho approvals pending"
                gradientScheme="primary"
              />
              <MetricCard
                title="High-demand certs"
                value="142"
                icon={Sparkles}
                description="Databricks, AWS & Snowflake certs count"
                gradientScheme="primary"
              />
            </div>

            {/* Cert Funnel & Technologies */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funnel */}
              <Card className="lg:col-span-2">
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    Zoho Certification Lifecycle Funnel
                  </span>
                  <div className="grid grid-cols-6 gap-2 text-center text-xs pt-4">
                    {(apiData?.certificationFunnel || [
                      { name: "Assigned", count: 520 },
                      { name: "Enrolled", count: 410 },
                      { name: "Started", count: 320 },
                      { name: "Completed", count: 240 },
                      { name: "Submitted", count: 215 },
                      { name: "Approved in Zoho", count: 195 }
                    ]).map((step, idx) => {
                      let color = "bg-primary/10 text-primary border border-primary/20";
                      if (idx === 0) color = "bg-gray-100 text-foreground";
                      else if (idx === 5) color = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                      return (
                        <div key={idx} className={`p-3 rounded-xl flex flex-col justify-between h-28 ${color} shadow-xs`}>
                          <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{step.name}</span>
                          <span className="text-base font-black">{step.count || step.val}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Technologies */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    High Demand Certifications
                  </span>
                  <div className="space-y-3">
                    {(apiData?.highDemandCertifications || [
                      { name: "Databricks", value: 48 },
                      { name: "AWS (Amazon Cloud)", value: 35 },
                      { name: "Microsoft Azure", value: 28 },
                      { name: "Google Cloud (GCP)", value: 18 },
                      { name: "Snowflake", value: 15 },
                      { name: "PMP", value: 8 }
                    ]).map((tech, idx) => {
                      const colors = ["bg-primary", "bg-accent", "bg-blue-600", "bg-amber-500", "bg-sky-400", "bg-cta"];
                      const val = tech.value || tech.count;
                      return (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span>{tech.name}</span>
                            <span>{val} completed</span>
                          </div>
                          <div className="h-2 bg-gray-150 rounded-full overflow-hidden">
                            <div className={`h-full ${colors[idx % colors.length]}`} style={{ width: `${(val / 48) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Certifications by Region, Project, Employee Grade */}
            <Card>
              <CardBody className="p-6 space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                  Zoho Certification Breakdowns
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Region */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-foreground">Certifications by Region</h4>
                    <div className="divide-y divide-border/60">
                      {Object.entries(apiData?.certificationsByRegion || {
                        "India Center": 185,
                        "Netherlands Center": 64,
                        "USA Center": 58,
                        "UK Center": 43
                      }).map(([k, v], idx) => (
                        <div key={idx} className="flex justify-between py-2">
                          <span className="font-semibold">{k}</span>
                          <span className="font-mono text-text-muted">{String(v)} completed</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-foreground">Certifications by Project</h4>
                    <div className="divide-y divide-border/60">
                      {Object.entries(apiData?.certificationsByProject || {
                        "Project Alpha": 42,
                        "Project Orion": 38,
                        "Project Sirius": 24,
                        "Project Polaris": 18
                      }).map(([k, v], idx) => (
                        <div key={idx} className="flex justify-between py-2">
                          <span className="font-semibold">{k}</span>
                          <span className="font-mono text-text-muted">{String(v)} completed</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Employee Grade */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-foreground">Certifications by Employee Grade</h4>
                    <div className="divide-y divide-border/60">
                      {Object.entries(apiData?.certificationsByEmployeeGrade || {
                        "Consultants": 142,
                        "Senior Consultants": 108,
                        "Tech Leads": 64,
                        "Principal Architects": 36
                      }).map(([k, v], idx) => (
                        <div key={idx} className="flex justify-between py-2">
                          <span className="font-semibold">{k}</span>
                          <span className="font-mono text-text-muted">{String(v)} completed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* T7: FLAGSHIP PROGRAM DASHBOARD */}
        {activeTab === "flagship" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(apiData || [
                { programName: "YMP (Young Managers Program)", participants: 60, completionPercentage: 95, learningHours: 240, feedbackScore: 4.8, certificationsAchieved: 42 },
                { programName: "Quantum Shift", participants: 45, completionPercentage: 80, learningHours: 180, feedbackScore: 4.6, certificationsAchieved: 28 },
                { programName: "Tech AI Thon", participants: 240, completionPercentage: 100, learningHours: 480, feedbackScore: 4.9, certificationsAchieved: 85 },
                { programName: "Databricks Program", participants: 80, completionPercentage: 75, learningHours: 320, feedbackScore: 4.7, certificationsAchieved: 38 },
                { programName: "GCV Certification Program", participants: 35, completionPercentage: 60, learningHours: 140, feedbackScore: 4.4, certificationsAchieved: 15 },
                { programName: "Kiro Learning Initiative", participants: 150, completionPercentage: 88, learningHours: 300, feedbackScore: 4.5, certificationsAchieved: 52 },
                { programName: "Copilot Learning Initiative", participants: 180, completionPercentage: 92, learningHours: 360, feedbackScore: 4.8, certificationsAchieved: 70 }
              ]).map((prog, idx) => (
                <Card key={idx} className="hoverable border border-border/80 flex flex-col justify-between" hoverable>
                  <CardBody className="p-5 space-y-4">
                    <span className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-md text-[9px] font-black text-primary uppercase tracking-wider inline-block">
                      Flagship Program
                    </span>
                    <h3 className="text-sm font-black text-foreground leading-snug line-clamp-1">{prog.programName || prog.name}</h3>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                      <div className="bg-gray-50 border border-border p-2 rounded-lg">
                        <span className="block font-black text-foreground">{prog.participants}</span>
                        <span className="text-[9px] font-bold text-text-muted">Participants</span>
                      </div>
                      <div className="bg-gray-50 border border-border p-2 rounded-lg">
                        <span className="block font-black text-foreground">{prog.completionPercentage}%</span>
                        <span className="text-[9px] font-bold text-text-muted">Completion</span>
                      </div>
                      <div className="bg-gray-50 border border-border p-2 rounded-lg">
                        <span className="block font-black text-foreground">{Math.round(prog.learningHours)}</span>
                        <span className="text-[9px] font-bold text-text-muted">Hours</span>
                      </div>
                    </div>
                  </CardBody>
                  <div className="bg-gray-50/50 border-t border-border px-5 py-3 flex justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider">
                    <span>Feedback: {prog.feedbackScore} / 5.0</span>
                    <span>Certs: {prog.certificationsAchieved}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* T8: TRENDS & EFFECTIVENESS */}
        {activeTab === "trends" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Trends Control Tabs */}
            <div className="flex gap-2">
              {["MoM", "QoQ", "YoY"].map((view) => (
                <button
                  key={view}
                  onClick={() => setTrendView(view)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    trendView === view
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-text-muted"
                  }`}
                >
                  {view} View
                </button>
              ))}
            </div>

            {/* Trend dashboard grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trends table */}
              <Card className="lg:col-span-2">
                <CardBody className="p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-black text-primary uppercase tracking-wider">
                      Learning Growth Trends ({trendView} analysis)
                    </span>
                    <span className="text-[10px] text-text-muted font-bold">Dynamic comparison metrics</span>
                  </div>
                  <div className="divide-y divide-border text-xs">
                    {[
                      { metric: "Sessions Conducted", current: executiveMetrics.sessions, prev: Math.round(executiveMetrics.sessions * 0.85), growth: "+15.0%" },
                      { metric: "Employees Trained", current: executiveMetrics.trained, prev: Math.round(executiveMetrics.trained * 0.88), growth: "+12.0%" },
                      { metric: "Learning Hours Logged", current: executiveMetrics.learningHours, prev: Math.round(executiveMetrics.learningHours * 0.82), growth: "+18.2%" },
                      { metric: "Certifications Achieved", current: executiveMetrics.certsCompleted, prev: Math.round(executiveMetrics.certsCompleted * 0.9), growth: `+${executiveMetrics.certGrowth}%` },
                      { metric: "AI Learning Growth", current: executiveMetrics.aiLearningHours, prev: Math.round(executiveMetrics.aiLearningHours * 0.65), growth: "+35.4%" }
                    ].map((row, idx) => {
                      let multiplier = trendView === "MoM" ? 0.35 : trendView === "YoY" ? 2.8 : 1.0;
                      let currVal = Math.round(row.current * multiplier);
                      let prevVal = Math.round(row.prev * multiplier);
                      return (
                        <div key={idx} className="flex justify-between py-3 items-center">
                          <span className="font-bold">{row.metric}</span>
                          <div className="flex items-center gap-6 font-semibold">
                            <span className="text-text-muted font-mono">{prevVal.toLocaleString()} (Prev)</span>
                            <span className="text-foreground font-mono">{currVal.toLocaleString()} (Curr)</span>
                            <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>{row.growth}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Growth Indicators & Effectiveness */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    Learning Growth Indicators
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 p-3 rounded-xl border border-border/80">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Training Growth</span>
                      <span className="text-lg font-black text-emerald-600 block font-mono mt-1">+{apiData?.trainingGrowthPercentage || "12.0"}%</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-border/80">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Learner Growth</span>
                      <span className="text-lg font-black text-emerald-600 block font-mono mt-1">+{apiData?.learnerGrowthPercentage || "14.2"}%</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-border/80">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Certification Growth</span>
                      <span className="text-lg font-black text-emerald-600 block font-mono mt-1">+{apiData?.certificationGrowthPercentage || "15.4"}%</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-border/80">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">AI Adoption Growth</span>
                      <span className="text-lg font-black text-emerald-600 block font-mono mt-1">+{apiData?.aiAdoptionGrowthPercentage || "35.4"}%</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Training Effectiveness Evaluation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    Training Effectiveness & CSAT Index
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-xs">
                    <div className="bg-gray-50 p-4 rounded-xl border border-border/80">
                      <span className="text-text-muted font-bold block">Feedback Score</span>
                      <span className="text-xl font-black text-primary font-mono mt-1.5 block">{apiData?.feedbackScore || executiveMetrics.avgFeedback} / 5.0</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-border/80">
                      <span className="text-text-muted font-bold block">Trainer Rating</span>
                      <span className="text-xl font-black text-foreground font-mono mt-1.5 block">{apiData?.trainerRating || "4.8"} / 5.0</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-border/80">
                      <span className="text-text-muted font-bold block">Session Rating</span>
                      <span className="text-xl font-black text-foreground font-mono mt-1.5 block">{apiData?.sessionRating || "4.7"} / 5.0</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-border/80">
                      <span className="text-text-muted font-bold block">Recommendation %</span>
                      <span className="text-xl font-black text-foreground font-mono mt-1.5 block">{apiData?.recommendationPercentage || executiveMetrics.recommendPercent}%</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-border/80">
                      <span className="text-text-muted font-bold block">Attendance %</span>
                      <span className="text-xl font-black text-foreground font-mono mt-1.5 block">{apiData?.attendancePercentage || "88"}%</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-border/80">
                      <span className="text-text-muted font-bold block">Completion %</span>
                      <span className="text-xl font-black text-foreground font-mono mt-1.5 block">{apiData?.completionPercentage || "84"}%</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Insights */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    Training Quality Insights
                  </span>
                  <div className="space-y-3.5 text-xs">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-1">
                      <span className="font-extrabold text-primary block">⭐ Best Rated Trainings</span>
                      <p className="font-bold text-foreground">
                        {apiData?.bestRatedTrainings?.[0] || "React Server Components (RSC)"} and {apiData?.bestRatedTrainings?.[1] || "Databricks Advanced SQL Workshop"}
                      </p>
                    </div>
                    <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl space-y-1">
                      <span className="font-extrabold text-accent block">👨‍🏫 Best Rated Trainers</span>
                      <p className="font-bold text-foreground">
                        {apiData?.bestRatedTrainers?.[0] || "Amit Verma (AI practice)"} and {apiData?.bestRatedTrainers?.[1] || "Priyanka Sharma (Next.js consultant)"}
                      </p>
                    </div>
                    <div className="p-3 bg-cta/5 border border-cta/20 rounded-xl space-y-1">
                      <span className="font-extrabold text-cta block">🔥 Most Impactful Program</span>
                      <p className="font-bold text-foreground">
                        {apiData?.mostImpactfulPrograms?.[0] || "Young Managers Program (YMP)"} and {apiData?.mostImpactfulPrograms?.[1] || "Tech AI Thon certification tracks"}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* T9: CHAMPIONS & INVESTMENT */}
        {activeTab === "champions" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recognition Categories */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    Learning Champions Dashboard
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      { category: "Top Learner of the Quarter", key: "topLearnerOfQuarter", defaultName: "Priyanka Sharma", defaultDetails: "48 hours logged", tag: "🏆 Quarterly Champion" },
                      { category: "Top AI Learner", key: "topAILearner", defaultName: "Amit Patel", defaultDetails: "GenAI pathway completed", tag: "🤖 AI Champion" },
                      { category: "Top Certified Employee", key: "topCertifiedEmployee", defaultName: "Siddharth Verma", defaultDetails: "3 external certs synced", tag: "🎓 Zoho Certified" },
                      { category: "Learning Champion", key: "learningChampion", defaultName: "Alex Jones", defaultDetails: "Conducted 12 cloud sessions", tag: "🌟 Team Champion" }
                    ].map((badge, idx) => {
                      const name = apiData?.[badge.key]?.name || badge.defaultName;
                      const details = apiData?.[badge.key]?.details || badge.defaultDetails;
                      const tag = apiData?.[badge.key]?.tag || badge.tag;
                      return (
                        <div key={idx} className="bg-gray-50 border border-border/80 rounded-xl p-4 space-y-2">
                          <span className="text-[9px] font-black text-text-muted uppercase tracking-wider block">
                            {badge.category}
                          </span>
                          <h4 className="text-sm font-extrabold text-foreground leading-tight">{name}</h4>
                          <p className="text-xs text-text-muted leading-tight">{details}</p>
                          <span className="inline-block px-2 py-0.5 bg-primary/10 border border-primary/20 text-[9px] font-black text-primary rounded-md uppercase tracking-wider mt-1.5">
                            {tag}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Project Investment */}
              <Card>
                <CardBody className="p-6 space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                    Project Learning Investment Dashboard
                  </span>
                  <div className="divide-y divide-border text-xs">
                    {(apiData?.projectInvestment || [
                      { project: "Project Alpha", employeesTrained: 48, learningHours: 240, certifications: 18, aiReadinessScore: 85, trainingCoveragePercentage: 94 },
                      { project: "Project Orion", employeesTrained: 35, learningHours: 195, certifications: 12, aiReadinessScore: 78, trainingCoveragePercentage: 88 },
                      { project: "Project Sirius", employeesTrained: 22, learningHours: 110, certifications: 6, aiReadinessScore: 62, trainingCoveragePercentage: 72 },
                      { project: "Project Polaris", employeesTrained: 18, learningHours: 95, certifications: 5, aiReadinessScore: 54, trainingCoveragePercentage: 65 },
                      { project: "Project Zenith", employeesTrained: 12, learningHours: 78, certifications: 4, aiReadinessScore: 48, trainingCoveragePercentage: 58 }
                    ]).map((row, idx) => (
                      <div key={idx} className="flex justify-between py-3 items-center">
                        <div>
                          <span className="font-bold block text-foreground">{row.project}</span>
                          <span className="text-[10px] text-text-muted font-bold font-mono">
                            {row.employeesTrained} trained ({Math.round(row.learningHours)}h) | Certs: {row.certifications}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 font-semibold">
                          <div className="text-right">
                            <span className="block font-black text-foreground font-mono">{row.trainingCoveragePercentage || row.invest}%</span>
                            <span className="text-[9px] font-bold text-text-muted">Coverage</span>
                          </div>
                          <div className="text-right">
                            <span className="block font-black text-accent font-mono">{row.aiReadinessScore || row.ai}/100</span>
                            <span className="text-[9px] font-bold text-text-muted">AI Score</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* T10: CAMPUS JOURNEY */}
        {activeTab === "freshers" && (
          <div className="space-y-6 animate-fadeIn">
            <Card>
              <CardBody className="p-6 space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-wider block border-b border-border pb-2">
                  Fresher / Apprentice Journey Dashboard
                </span>
                <div className="grid grid-cols-6 gap-2 text-center text-xs pt-4">
                  {(apiData?.journeyFunnel || [
                    { name: "Campus Hiring", count: 120, percentage: 100 },
                    { name: "Training Enrollment", count: 120, percentage: 100 },
                    { name: "Training Completion", count: 108, percentage: 90 },
                    { name: "Certification Completion", count: 84, percentage: 70 },
                    { name: "Project Allocation", count: 78, percentage: 65 },
                    { name: "Billable Deployment", count: 72, percentage: 60 }
                  ]).map((step, idx) => {
                    let color = "bg-primary/10 text-primary border border-primary/20";
                    if (idx === 0) color = "bg-gray-100 text-foreground";
                    else if (idx === 5) color = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                    return (
                      <div key={idx} className={`p-3 rounded-xl flex flex-col justify-between h-32 ${color} shadow-xs`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{step.name}</span>
                        <div>
                          <span className="text-lg font-black block">{step.count || step.val}</span>
                          <span className="text-[10px] font-mono block mt-1">{step.percentage || step.pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gray-50 border border-border/50 rounded-xl p-4 grid grid-cols-3 gap-6 text-xs text-center mt-4">
                  <div>
                    <span className="text-text-muted font-bold block">Freshers Hired</span>
                    <span className="text-xl font-black text-foreground font-mono mt-1 block">{apiData?.freshersHired || 120} Hires</span>
                  </div>
                  <div>
                    <span className="text-text-muted font-bold block">Deployment %</span>
                    <span className="text-xl font-black text-emerald-600 font-mono mt-1 block">{apiData?.deploymentPercentage || 60}%</span>
                  </div>
                  <div>
                    <span className="text-text-muted font-bold block">Time to Deployment</span>
                    <span className="text-xl font-black text-foreground font-mono mt-1 block">{apiData?.timeToDeployment || 45} Days</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* T11: FUTURE ROADMAP */}
        {activeTab === "future" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Skill Gap Dashboard */}
              <Card className="border border-dashed border-primary bg-primary/5">
                <CardBody className="p-6 space-y-4">
                  <h3 className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/20 pb-2">
                    <Target className="w-4 h-4" />
                    <span>Skill Gap Dashboard (Roadmap)</span>
                  </h3>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    Will display organizational skill gaps by project, practice, and client resource requirements.
                  </p>
                  <div className="space-y-3 pt-2 opacity-60 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-foreground">
                        <span>Current Skills vs Required Skills</span>
                        <span>{apiData?.currentSkillsVsRequiredSkills || 82}% match</span>
                      </div>
                      <div className="h-2 bg-gray-250 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${apiData?.currentSkillsVsRequiredSkills || 82}%` }} />
                      </div>
                    </div>
                    <div className="pt-1 flex justify-between font-bold">
                      <span>Skill Gap by Project:</span>
                      <span className="text-primary font-mono">
                        {apiData?.skillGapByProject?.[0]?.name || "React"} {apiData?.skillGapByProject?.[0]?.value || -12}%
                      </span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Skill Gap by Practice:</span>
                      <span className="text-primary font-mono">
                        {apiData?.skillGapByPractice?.[0]?.name || "Databricks"} {apiData?.skillGapByPractice?.[0]?.value || -18}%
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Learning Recommendation Engine */}
              <Card className="border border-dashed border-accent bg-accent/5">
                <CardBody className="p-6 space-y-4">
                  <h3 className="text-xs font-black text-accent uppercase tracking-wider flex items-center gap-1.5 border-b border-accent/20 pb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Learning Recommendation Engine (Roadmap)</span>
                  </h3>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    Personalized dashboard recommendations powered by user telemetry data and skill track requirements.
                  </p>
                  <div className="space-y-2 pt-2 opacity-60 text-[11px] font-bold text-foreground">
                    <div className="p-2 bg-white rounded-lg border border-accent/20">
                      💡 Suggested: {apiData?.suggestedCourses?.[0] || "Next.js App Router Masterclass"}
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-accent/20">
                      💡 Suggested Certs: {apiData?.suggestedCertifications?.[0] || "Databricks Certified Engineer"}
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-accent/20">
                      💡 Career Learning: {apiData?.suggestedCareerPathLearning?.[0] || "Solutions Architect Track"}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Predictive Analytics */}
              <Card className="border border-dashed border-cta bg-cta/5">
                <CardBody className="p-6 space-y-4">
                  <h3 className="text-xs font-black text-cta uppercase tracking-wider flex items-center gap-1.5 border-b border-cta/20 pb-2">
                    <LineChart className="w-4 h-4" />
                    <span>Predictive Analytics (Roadmap)</span>
                  </h3>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    Forecast model predicting Zoho certification completions, upskilling metrics, and AI readiness forecasts.
                  </p>
                  <div className="space-y-2 pt-2 opacity-60 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Cert Completion Prediction:</span>
                      <span className="text-cta font-mono">{apiData?.certificationCompletionPrediction || 82}% on-time</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Learning Risk Indicators:</span>
                      <span className="text-cta font-mono">{apiData?.learningRiskIndicators || 5} profiles</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>AI Readiness Forecast:</span>
                      <span className="text-cta font-mono">{apiData?.aiReadinessForecast || 92}% by Q4 2026</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
