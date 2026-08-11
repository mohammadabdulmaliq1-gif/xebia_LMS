"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiService } from "@/lib/apiService";
import useToast from "@/hooks/useToast";
import Card, { CardBody } from "@/components/common/Card";
import Button from "@/components/common/Button";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Globe,
  Tag,
  Building,
  CheckCircle,
  XCircle,
  Video,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const { id } = params;

  const [currentUser, setCurrentUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 1. Fetch user
      const user = apiService.getCurrentUser();
      if (!user) {
        router.push("/signin");
        return;
      }
      setCurrentUser(user);

      // 2. Fetch event details
      const fetchedEvent = await apiService.getEventById(id);
      setEvent(fetchedEvent);

      // 3. Check if current user is registered
      if (user.role === "learner") {
        const regs = await apiService.getEventRegistrations(id);
        const registered = regs.some(
          (r) => r.learnerId === user.id && r.status?.toUpperCase() === "REGISTERED"
        );
        setIsRegistered(registered);
      }
    } catch (err) {
      console.error("Error loading event detail:", err);
      toast.addToast("Failed to load event details.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleRegister = async () => {
    try {
      const res = await apiService.registerForEvent(id, currentUser.id);
      toast.addToast(res.message || "Successfully registered for event!", "success");
      loadData();
    } catch (err) {
      toast.addToast(err.message || "Registration failed.", "error");
    }
  };

  const handleCancelRegistration = async () => {
    if (!confirm("Are you sure you want to cancel your registration?")) return;
    try {
      const res = await apiService.cancelEventRegistration(id, currentUser.id);
      toast.addToast(res.message || "Registration cancelled successfully.", "success");
      loadData();
    } catch (err) {
      toast.addToast(err.message || "Cancellation failed.", "error");
    }
  };

  const isDeadlinePassed = () => {
    if (!event || !event.registrationDeadline) return false;
    return new Date() > new Date(event.registrationDeadline);
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-base font-extrabold text-foreground">Event not found</h3>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const isFull = event.currentRegistrations >= event.maximumCapacity;
  const deadlinePassed = isDeadlinePassed();
  const closed = event.status?.toUpperCase() === "CLOSED";
  const cancelled = event.status?.toUpperCase() === "CANCELLED";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event details, description, info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner and title */}
          <div className="overflow-hidden bg-white border border-border rounded-3xl shadow-sm">
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100 border-b border-border">
              <img
                src={event.bannerImage}
                alt={event.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop";
                }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-sm text-[10px] font-black text-primary uppercase tracking-wide">
                  {event.mode}
                </span>
                {cancelled && (
                  <span className="px-2.5 py-1 bg-rose-500 text-white rounded-lg shadow-sm text-[10px] font-black uppercase">
                    Cancelled
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-lg uppercase">
                  {event.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-text-muted text-[10px] font-bold rounded-lg uppercase">
                  {event.department}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-foreground leading-snug">
                {event.title}
              </h1>

              {/* Description */}
              <div className="pt-4 border-t border-border space-y-4">
                <h3 className="text-sm font-extrabold text-foreground">About this Event</h3>
                <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Time, Location, Register Card */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardBody className="p-6 space-y-6">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-3">
                Event Information
              </h3>

              {/* Key details list */}
              <div className="space-y-4 text-xs">
                {/* Dates */}
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground">Date & Time</p>
                    <p className="text-[11px] text-text-muted">Start: {formatEventDate(event.startDate)}</p>
                    <p className="text-[11px] text-text-muted">End: {formatEventDate(event.endDate)}</p>
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground">Registration Deadline</p>
                    <p className="text-[11px] text-rose-600 font-semibold">
                      {formatEventDate(event.registrationDeadline)}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground">Location & Venue</p>
                    <p className="text-[11px] text-text-muted">
                      {event.mode === "ONLINE" ? "Virtual (Meeting Link provided on registration)" : event.location}
                    </p>
                    {event.venue && <p className="text-[10px] text-text-muted/80">{event.venue}</p>}
                  </div>
                </div>

                {/* Organizer */}
                <div className="flex gap-3">
                  <Building className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground">Organizer</p>
                    <p className="text-[11px] text-text-muted">{event.organizer || "Xebia Enterprise"}</p>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="flex gap-3">
                  <Tag className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground">Eligibility</p>
                    <p className="text-[11px] text-text-muted">{event.eligibility || "Open to all batches"}</p>
                    {event.batchRestrictions && event.batchRestrictions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.batchRestrictions.map(b => (
                          <span key={b} className="px-1.5 py-0.5 bg-gray-100 text-text-muted text-[9px] font-bold rounded">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress and Seats info */}
              <div className="bg-gray-50/50 border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Registrations</span>
                  </div>
                  <span className="text-text-muted">
                    {event.currentRegistrations} / {event.maximumCapacity}
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isFull ? "bg-rose-500" : "bg-primary"}`}
                    style={{ width: `${Math.min(100, (event.currentRegistrations / event.maximumCapacity) * 100)}%` }}
                  ></div>
                </div>

                <div className="text-[10px] text-center text-text-muted font-semibold">
                  {isFull ? "All seats are fully booked." : `${event.maximumCapacity - event.currentRegistrations} seats remaining.`}
                </div>
              </div>

              {/* Meeting Link (Only if Online, User is Registered, and not Cancelled) */}
              {event.mode === "ONLINE" && isRegistered && !cancelled && event.meetingLink && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <Video className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                    <span>Online Meeting Joined</span>
                  </div>
                  <a
                    href={event.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Launch Meeting</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Register / Cancel Button */}
              {currentUser.role === "learner" && !cancelled && (
                <div className="space-y-2 pt-2 border-t border-border">
                  {isRegistered ? (
                    <Button
                      variant="danger"
                      className="w-full justify-center"
                      disabled={deadlinePassed}
                      onClick={handleCancelRegistration}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      <span>Cancel Registration</span>
                    </Button>
                  ) : (
                    <Button
                      variant={isFull || deadlinePassed || closed ? "outline" : "primary"}
                      className="w-full justify-center"
                      disabled={isFull || deadlinePassed || closed}
                      onClick={handleRegister}
                    >
                      {closed ? (
                        <span>Registration Closed</span>
                      ) : deadlinePassed ? (
                        <span>Deadline Passed</span>
                      ) : isFull ? (
                        <span>Sold Out</span>
                      ) : (
                        <span>Register Now</span>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
