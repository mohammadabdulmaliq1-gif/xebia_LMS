"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/apiService";
import useToast from "@/hooks/useToast";
import Card, { CardBody } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { ArrowLeft, Save, Globe, Info } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [category, setCategory] = useState("Technical");
  const [department, setDepartment] = useState("Engineering");
  const [organizer, setOrganizer] = useState("Xebia Academy");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [maximumCapacity, setMaximumCapacity] = useState(50);
  const [eligibility, setEligibility] = useState("All Consultants");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [mode, setMode] = useState("ONLINE");
  const [meetingLink, setMeetingLink] = useState("");
  const [courseRestrictions, setCourseRestrictions] = useState("");

  const presetBanners = [
    { name: "Tech Hackathon", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop" },
    { name: "Workshop Training", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop" },
    { name: "Code Camp", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop" },
    { name: "Meetup Seminar", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop" }
  ];

  useEffect(() => {
    async function init() {
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

        // Fetch batches to restriction selection
        const fetchedClasses = await apiService.getClasses();
        const distinctBatches = Array.from(new Set(fetchedClasses.map(c => c.batch).filter(Boolean)));
        setBatches(distinctBatches);
      } catch (err) {
        console.error("Error initializing create page:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleBatchToggle = (b) => {
    setSelectedBatches(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const handleFormSubmit = async (e, publishNow = false) => {
    e.preventDefault();

    if (!title || !description || !startDate || !endDate || !registrationDeadline || !mode) {
      toast.addToast("Please fill in all required fields.", "error");
      return;
    }

    if (maximumCapacity <= 0) {
      toast.addToast("Maximum capacity must be greater than 0.", "error");
      return;
    }

    // Date validations
    const start = new Date(startDate);
    const end = new Date(endDate);
    const deadline = new Date(registrationDeadline);

    if (start >= end) {
      toast.addToast("Event start date must be before the end date.", "error");
      return;
    }

    if (deadline >= start) {
      toast.addToast("Registration deadline must be before the event start date.", "error");
      return;
    }

    const payload = {
      title,
      description,
      bannerImage: bannerImage || presetBanners[0].url,
      category,
      department,
      organizer,
      venue,
      location: mode === "ONLINE" ? "Virtual" : location,
      startDate,
      endDate,
      registrationDeadline,
      maximumCapacity: Number(maximumCapacity),
      eligibility,
      batchRestrictions: selectedBatches,
      courseRestrictions: courseRestrictions ? courseRestrictions.split(",").map(c => c.trim()) : [],
      mode,
      meetingLink: mode === "ONLINE" ? meetingLink : "",
      status: publishNow ? "PUBLISHED" : "DRAFT"
    };

    try {
      await apiService.createEvent(payload, currentUser.id);
      toast.addToast(
        publishNow ? "Event created and published successfully!" : "Draft event saved successfully.",
        "success"
      );
      router.push("/admin/events");
    } catch (err) {
      toast.addToast(err.message || "Failed to create event.", "error");
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
      {/* Header back link */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Create Corporate Event</h1>
          <p className="text-xs text-text-muted">Draft a new training workshop, townhall meeting or hackathon.</p>
        </div>

        <Card>
          <CardBody className="p-6 sm:p-8">
            <form className="space-y-6">
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Event Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Spring Boot 3.4 Security & Integration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  required
                />
              </div>

              {/* Category, Dept, Organizer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Category <span className="text-rose-500">*</span></label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Technical">Technical Workshop</option>
                    <option value="Townhall">Townhall Meeting</option>
                    <option value="Soft Skills">Soft Skills Training</option>
                    <option value="Hackathon">Coding Hackathon</option>
                    <option value="Certification">Certification Camp</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Target Department <span className="text-rose-500">*</span></label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Consulting">Consulting</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Organizer <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">About the Event <span className="text-rose-500">*</span></label>
                <textarea
                  placeholder="Describe what the event covers, key takeaways, eligibility conditions, required installations, or prerequisites..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white resize-none"
                  required
                />
              </div>

              {/* Banner Image Preset Select */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-foreground block">Event Banner Image</label>
                <input
                  type="text"
                  placeholder="Paste banner image URL..."
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white mb-2"
                />
                <div className="text-[10px] font-bold text-text-muted mb-1.5 uppercase">Or select a visual template:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {presetBanners.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setBannerImage(p.url)}
                      className={`relative aspect-video w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        bannerImage === p.url ? "border-primary ring-2 ring-primary/20 scale-[0.98]" : "border-border hover:border-text-muted"
                      }`}
                    >
                      <img src={p.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                        <span className="text-[9px] font-extrabold text-white text-center px-1 uppercase tracking-wide leading-none">{p.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode, Location, Venue, Meeting Link */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/60">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Event Mode <span className="text-rose-500">*</span></label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="ONLINE">Online Meeting</option>
                    <option value="OFFLINE">Offline Venue</option>
                    <option value="HYBRID">Hybrid (Both)</option>
                  </select>
                </div>

                {mode !== "ONLINE" ? (
                  <>
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="text-xs font-bold text-foreground">Location City <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Gurgaon, Noida"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="text-xs font-bold text-foreground">Venue Address</label>
                      <input
                        type="text"
                        placeholder="e.g. Tower C, 5th Floor Conference Hall"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5 md:col-span-2 animate-fadeIn">
                    <label className="text-xs font-bold text-foreground">Virtual Meeting Link</label>
                    <input
                      type="url"
                      placeholder="e.g. Teams, Zoom, or Google Meet URL"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Dates & Deadlines */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/60">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Start Date & Time <span className="text-rose-500">*</span></label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">End Date & Time <span className="text-rose-500">*</span></label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Registration Deadline <span className="text-rose-500">*</span></label>
                  <input
                    type="datetime-local"
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Capacity, Eligibility, Batch restriction */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/60">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Maximum Seats Capacity <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    value={maximumCapacity}
                    min={1}
                    onChange={(e) => setMaximumCapacity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Eligibility Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. DevOps Consultants only, Open for all"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Eligible Courses (Optional)</label>
                  <input
                    type="text"
                    placeholder="Course IDs comma-separated"
                    value={courseRestrictions}
                    onChange={(e) => setCourseRestrictions(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                </div>
              </div>

              {/* Batch restrictions checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">Restrict to Specific Batches (Optional)</label>
                <div className="bg-gray-50 border border-border rounded-2xl p-4 flex flex-wrap gap-4">
                  {batches.length === 0 ? (
                    <div className="text-[10px] text-text-muted font-bold uppercase">No active classes found to restrict.</div>
                  ) : (
                    batches.map((b) => (
                      <label key={b} className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-text-muted">
                        <input
                          type="checkbox"
                          checked={selectedBatches.includes(b)}
                          onChange={() => handleBatchToggle(b)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span>{b}</span>
                      </label>
                    ))
                  )}
                </div>
                <div className="text-[10px] text-text-muted font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>If no batch is checked, the event remains open to all learners.</span>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/events")}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/5 flex items-center gap-1.5"
                  onClick={(e) => handleFormSubmit(e, false)}
                >
                  <Save className="w-4 h-4" />
                  <span>Save as Draft</span>
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-1.5"
                  onClick={(e) => handleFormSubmit(e, true)}
                >
                  <Globe className="w-4 h-4" />
                  <span>Create & Publish</span>
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
