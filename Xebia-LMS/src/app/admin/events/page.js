"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/apiService";
import useToast from "@/hooks/useToast";
import Card, { CardBody } from "@/components/common/Card";
import Button from "@/components/common/Button";
import StatusBadge from "@/components/common/StatusBadge";
import MetricCard from "@/components/common/MetricCard";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Sliders,
  Award,
  Layers,
  Sparkles
} from "lucide-react";

export default function AdminEventsDashboardPage() {
  const router = useRouter();
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    registrations: 0
  });

  const loadData = async () => {
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

      const fetchedEvents = await apiService.getAdminEvents();
      setEvents(fetchedEvents);

      // Compute metrics
      const total = fetchedEvents.length;
      const published = fetchedEvents.filter(e => e.status?.toUpperCase() === "PUBLISHED").length;
      const drafts = fetchedEvents.filter(e => e.status?.toUpperCase() === "DRAFT").length;
      const regs = fetchedEvents.reduce((acc, e) => acc + (e.currentRegistrations || 0), 0);

      setMetrics({ total, published, drafts, registrations: regs });
    } catch (err) {
      console.error("Error loading admin events:", err);
      toast.addToast("Failed to load events administration dashboard.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will remove all associated student registrations!`)) return;
    try {
      await apiService.deleteEvent(id);
      toast.addToast("Event deleted successfully.", "success");
      loadData();
    } catch (err) {
      toast.addToast(err.message || "Failed to delete event.", "error");
    }
  };

  const handlePublish = async (id) => {
    try {
      await apiService.publishEvent(id);
      toast.addToast("Event published successfully!", "success");
      loadData();
    } catch (err) {
      toast.addToast(err.message || "Failed to publish event.", "error");
    }
  };

  const handleClose = async (id) => {
    try {
      await apiService.closeEventRegistration(id);
      toast.addToast("Event registration closed successfully.", "success");
      loadData();
    } catch (err) {
      toast.addToast(err.message || "Failed to close registration.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Event Administration</h1>
          <p className="text-xs text-text-muted">Create, schedule, publish, and manage corporate workshop registrations.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 shadow-sm"
          onClick={() => router.push("/admin/events/create")}
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Create Event</span>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Events"
          value={metrics.total}
          icon={Calendar}
          gradientScheme="primary"
          trend="Corporate schedule catalog"
        />
        <MetricCard
          title="Published Events"
          value={metrics.published}
          icon={Globe}
          gradientScheme="primary"
          trend="Live & open registrations"
        />
        <MetricCard
          title="Draft Events"
          value={metrics.drafts}
          icon={Sliders}
          gradientScheme="primary"
          trend="Under review / edits"
        />
        <MetricCard
          title="Total Registrations"
          value={metrics.registrations}
          icon={Users}
          gradientScheme="primary"
          trend="Active student bookings"
        />
      </div>

      {/* Events Admin Table */}
      <Card>
        <div className="p-4 border-b border-border bg-gray-50/30 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-text-muted">Event Schedule Catalog</h2>
          <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
            {events.length} Events Total
          </span>
        </div>

        <CardBody className="p-0">
          {events.length === 0 ? (
            <div className="p-12 text-center text-xs text-text-muted">
              No events found. Click "Create Event" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-border text-left text-xs font-semibold">
                <thead className="bg-gray-50/50 text-[10px] text-text-muted font-black uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Banner & Title</th>
                    <th className="px-6 py-4">Category / Dept</th>
                    <th className="px-6 py-4">Mode / Location</th>
                    <th className="px-6 py-4">Schedule Dates</th>
                    <th className="px-6 py-4">Seats filled</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.bannerImage}
                            alt=""
                            className="w-12 h-8 object-cover rounded-md border border-border"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop";
                            }}
                          />
                          <div>
                            <div className="font-extrabold text-foreground max-w-xs truncate">{event.title}</div>
                            <div className="text-[10px] text-text-muted mt-0.5">Organizer: {event.organizer}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold rounded">
                            {event.category}
                          </span>
                          <div className="text-[9px] text-text-muted font-bold uppercase">{event.department}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-extrabold text-foreground">{event.mode}</div>
                        <div className="text-[10px] text-text-muted max-w-[150px] truncate">
                          {event.mode === "ONLINE" ? event.meetingLink : event.location}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[10px]">Start: {new Date(event.startDate).toLocaleDateString()}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{event.currentRegistrations} / {event.maximumCapacity}</span>
                          <span className="text-[10px] text-text-muted">({Math.round((event.currentRegistrations / event.maximumCapacity) * 100)}%)</span>
                        </div>
                        {/* tiny progress bar */}
                        <div className="w-20 bg-gray-100 h-1 rounded-full overflow-hidden mt-1.5">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${(event.currentRegistrations / event.maximumCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-full ${getStatusColorClass(event.status)}`}>
                          {event.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                        {event.status?.toUpperCase() === "DRAFT" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 border-emerald-200 text-emerald-700 bg-emerald-50/20 hover:bg-emerald-50"
                            onClick={() => handlePublish(event.id)}
                            title="Publish event to learners"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        {event.status?.toUpperCase() === "PUBLISHED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 border-amber-200 text-amber-700 bg-amber-50/20 hover:bg-amber-50"
                            onClick={() => handleClose(event.id)}
                            title="Close registrations"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="px-2 py-1"
                          onClick={() => router.push(`/admin/events/${event.id}/registrations`)}
                          title="View registered students list"
                        >
                          <Users className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="px-2 py-1"
                          onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                          title="Edit event details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="px-2 py-1 text-rose-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50"
                          onClick={() => handleDelete(event.id, event.title)}
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
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

const getStatusColorClass = (status) => {
  switch (status?.toUpperCase()) {
    case "PUBLISHED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CLOSED": return "bg-rose-50 text-rose-700 border-rose-200";
    case "CANCELLED": return "bg-gray-100 text-gray-600 border-gray-200";
    default: return "bg-amber-50 text-amber-700 border-amber-200";
  }
};
