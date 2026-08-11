"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiService } from "@/lib/apiService";
import useToast from "@/hooks/useToast";
import Card, { CardBody } from "@/components/common/Card";
import Button from "@/components/common/Button";
import StatusBadge from "@/components/common/StatusBadge";
import {
  ArrowLeft,
  Download,
  Search,
  Users,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

export default function EventRegistrationsPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const { id } = params;

  const [currentUser, setCurrentUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const user = apiService.getCurrentUser();
      if (!user) {
        router.push("/signin");
        return;
      }
      if (user.role !== "admin" && user.role !== "teacher") {
        router.push("/dashboard");
        return;
      }
      setCurrentUser(user);

      // Fetch Event details
      const fetchedEvent = await apiService.getEventById(id);
      setEvent(fetchedEvent);

      // Fetch Registrations
      const fetchedRegs = await apiService.getEventRegistrations(id);
      setRegistrations(fetchedRegs);
    } catch (err) {
      console.error("Error loading registrations:", err);
      toast.addToast("Failed to load registration records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast.addToast("No registrations available to export.", "error");
      return;
    }

    const headers = ["Registration ID", "Student Name", "Email", "Batch", "Roll Number", "Registration Time", "Status"];
    const rows = filteredRegistrations.map((r) => [
      r.id,
      r.learnerName,
      r.learnerEmail,
      r.learnerBatch,
      r.learnerRollNumber || "N/A",
      r.registrationTime ? new Date(r.registrationTime).toLocaleString() : "N/A",
      r.status
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Event_Registrations_${event.title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.addToast("CSV export downloaded successfully.", "success");
  };

  const filteredRegistrations = registrations.filter((r) => {
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const nameMatch = r.learnerName?.toLowerCase().includes(q);
      const emailMatch = r.learnerEmail?.toLowerCase().includes(q);
      const batchMatch = r.learnerBatch?.toLowerCase().includes(q);
      const rollMatch = r.learnerRollNumber?.toLowerCase().includes(q);
      if (!nameMatch && !emailMatch && !batchMatch && !rollMatch) return false;
    }

    // Status filter
    if (statusFilter !== "ALL") {
      if (r.status?.toUpperCase() !== statusFilter) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h3 className="text-base font-extrabold text-foreground">Event not found</h3>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Back Button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Administration</span>
        </button>
      </div>

      {/* Event Details Card */}
      <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold rounded uppercase">
              {event.category}
            </span>
            <span className="text-[10px] text-text-muted font-bold uppercase">{event.department}</span>
          </div>
          <h1 className="text-lg font-black text-foreground">{event.title}</h1>
          <p className="text-[10px] text-text-muted">
            Scheduled: {new Date(event.startDate).toLocaleDateString()} | Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-50 border border-border rounded-2xl p-4 flex items-center gap-4 self-stretch sm:self-auto justify-between">
          <div className="text-center px-2">
            <p className="text-lg font-black text-primary leading-tight">{event.currentRegistrations}</p>
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Registered</p>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <div className="text-center px-2">
            <p className="text-lg font-black text-foreground leading-tight">{event.maximumCapacity}</p>
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Capacity</p>
          </div>
        </div>
      </div>

      {/* Filter and Export Bar */}
      <Card>
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto flex-1">
            <div className="relative sm:col-span-2">
              <input
                type="text"
                placeholder="Search students by name, email, roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Statuses</option>
                <option value="REGISTERED">Registered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </Card>

      {/* Registrations List Table */}
      <Card>
        <div className="p-4 border-b border-border bg-gray-50/30 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-text-muted">Registered Students List</h2>
          <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
            {filteredRegistrations.length} Students Listed
          </span>
        </div>

        <CardBody className="p-0">
          {filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center text-xs text-text-muted">
              No registration records match this filter query.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-border text-left text-xs font-semibold">
                <thead className="bg-gray-50/50 text-[10px] text-text-muted font-black uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Student Details</th>
                    <th className="px-6 py-4">Batch Info</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4">Registration Time</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-foreground">{reg.learnerName}</div>
                          <div className="text-[10px] text-text-muted">{reg.learnerEmail}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold rounded">
                          {reg.learnerBatch}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-extrabold text-foreground">{reg.learnerRollNumber || "N/A"}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-text-muted text-[10px]">
                        {reg.registrationTime ? new Date(reg.registrationTime).toLocaleString() : "N/A"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 border text-[9px] font-bold rounded-full ${
                          reg.status?.toUpperCase() === "REGISTERED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
