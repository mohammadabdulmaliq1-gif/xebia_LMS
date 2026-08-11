package com.xebia.lms.service.analytics;

import com.xebia.lms.dto.analytics.FilterParams;
import com.xebia.lms.model.analytics.*;
import com.xebia.lms.repository.analytics.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private NominationRepository nominationRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private AIUsageRepository aiUsageRepository;

    @Autowired
    private FresherApprenticeRepository fresherApprenticeRepository;

    @PostConstruct
    public void seedAnalyticsData() {
        if (employeeRepository.count() > 0) {
            return;
        }

        System.out.println("Seeding Leadership Learning Analytics Mock Data...");
        Random rnd = new Random(42); // Deterministic random seed

        String[] regions = {"India", "USA", "UK", "Netherlands", "Middle East"};
        String[] locations = {"Gurugram", "Bengaluru", "Noida", "Atlanta", "London", "Amsterdam", "Dubai"};
        String[] bus = {"Cloud Engineering", "Data & AI", "Software Engineering", "Agile & Devops", "Salesforce"};
        String[] depts = {"Digital Solutions", "Data Science", "Platform Ops", "Security Practice", "Advisory Services"};
        String[] projects = {"Project Alpha", "Project Orion", "Project Sirius", "Project Polaris", "Project Zenith"};
        String[] practices = {"Microsoft Azure", "AWS", "Google Cloud", "Databricks", "Snowflake", "Generative AI"};
        String[] grades = {"Principal Consultant", "Senior Consultant", "Consultant", "Associate Consultant", "Tech Lead"};

        // 1. Seed 150 Employees
        List<Employee> employeeList = new ArrayList<>();
        for (int i = 1; i <= 150; i++) {
            String region = regions[i % regions.length];
            String location = locations[i % locations.length];
            String bu = bus[i % bus.length];
            String dept = depts[i % depts.length];
            String project = projects[i % projects.length];
            String practice = practices[i % practices.length];
            String grade = grades[i % grades.length];
            String date = "2025-0" + (1 + (i % 9)) + "-" + (10 + (i % 15));

            Employee emp = Employee.builder()
                    .id("emp-" + i)
                    .name("Employee " + i)
                    .email("employee" + i + "@xebia.com")
                    .region(region)
                    .location(location)
                    .businessUnit(bu)
                    .department(dept)
                    .project(project)
                    .practice(practice)
                    .grade(grade)
                    .createdAt(date)
                    .build();
            employeeList.add(emp);
        }
        employeeRepository.saveAll(employeeList);

        // 2. Seed 15 Trainings
        List<Training> trainingList = new ArrayList<>();
        // Compliance
        trainingList.add(new Training("tr-1", "POSH & Compliance", "Compliance Learning", false, null, 4.2, 4.0));
        trainingList.add(new Training("tr-2", "Security Awareness", "Compliance Learning", false, null, 4.4, 4.3));
        // Technical
        trainingList.add(new Training("tr-3", "Databricks Core", "Technical Learning", false, "Databricks Program", 4.7, 4.8));
        trainingList.add(new Training("tr-4", "AWS Solution Architect", "Technical Learning", false, null, 4.6, 4.6));
        trainingList.add(new Training("tr-5", "Next.js App Router Masterclass", "Technical Learning", false, null, 4.8, 4.9));
        // AI & GenAI
        trainingList.add(new Training("tr-6", "Copilot Developer Mastery", "AI & GenAI Learning", true, "Copilot Learning Initiative", 4.9, 4.9));
        trainingList.add(new Training("tr-7", "Kiro AI Architecture", "AI & GenAI Learning", true, "Kiro Learning Initiative", 4.8, 4.8));
        trainingList.add(new Training("tr-8", "Claude API Deep Dive", "AI & GenAI Learning", true, "Tech AI Thon", 4.9, 4.8));
        // Leadership
        trainingList.add(new Training("tr-9", "Young Managers Program", "Leadership Development", false, "YMP (Young Managers Program)", 4.8, 4.7));
        trainingList.add(new Training("tr-10", "Quantum Shift Executive", "Leadership Development", false, "Quantum Shift", 4.7, 4.8));
        // Upskilling
        trainingList.add(new Training("tr-11", "Solution Architect transition", "Upskilling & Cross-Skilling", false, null, 4.5, 4.4));
        trainingList.add(new Training("tr-12", "GCV Certification Preparation", "Upskilling & Cross-Skilling", false, "GCV Certification Program", 4.3, 4.5));

        trainingRepository.saveAll(trainingList);

        // 3. Seed 40 Sessions
        List<Session> sessionList = new ArrayList<>();
        for (int i = 1; i <= 40; i++) {
            String trId = "tr-" + (1 + (i % 12));
            String date = "2025-0" + (1 + (i % 6)) + "-" + (10 + (i % 15));
            Session session = Session.builder()
                    .id("sess-" + i)
                    .trainingId(trId)
                    .sessionDate(date)
                    .attendeesCount(10 + rnd.nextInt(25))
                    .learningHours(20.0 + rnd.nextInt(60))
                    .durationHours(2.0 + rnd.nextInt(4))
                    .build();
            sessionList.add(session);
        }
        sessionRepository.saveAll(sessionList);

        // 4. Seed 250 Nominations
        List<Nomination> nominationList = new ArrayList<>();
        for (int i = 1; i <= 250; i++) {
            String empId = "emp-" + (1 + rnd.nextInt(150));
            String trId = "tr-" + (1 + rnd.nextInt(12));
            String status = rnd.nextBoolean() ? "TRAINED" : "NOMINATED";
            String date = "2025-0" + (1 + (i % 6)) + "-" + (10 + (i % 15));

            Nomination nom = Nomination.builder()
                    .id("nom-" + i)
                    .employeeId(empId)
                    .trainingId(trId)
                    .status(status)
                    .nominatedDate(date)
                    .build();
            nominationList.add(nom);
        }
        nominationRepository.saveAll(nominationList);

        // 5. Seed 180 Certifications
        List<Certification> certList = new ArrayList<>();
        String[] techs = {"Databricks", "AWS", "Azure", "GCP", "Snowflake", "PMP"};
        String[] statuses = {"Assigned", "Enrolled", "Started", "Completed", "Submitted", "Approved"};
        for (int i = 1; i <= 180; i++) {
            Employee emp = employeeList.get(rnd.nextInt(employeeList.size()));
            String tech = techs[i % techs.length];
            String status = statuses[i % statuses.length];
            String date = "2025-0" + (1 + (i % 8)) + "-" + (10 + (i % 15));

            Certification cert = Certification.builder()
                    .id("cert-" + i)
                    .employeeId(emp.getId())
                    .name(tech + " Certificate")
                    .technology(tech)
                    .status(status)
                    .completionDate(date)
                    .region(emp.getRegion())
                    .project(emp.getProject())
                    .grade(emp.getGrade())
                    .build();
            certList.add(cert);
        }
        certificationRepository.saveAll(certList);

        // 6. Seed 120 AIUsage records
        List<AIUsage> aiUsageList = new ArrayList<>();
        String[] tools = {"Copilot", "Kiro", "Claude", "Other"};
        for (int i = 1; i <= 120; i++) {
            String empId = "emp-" + (1 + rnd.nextInt(150));
            String tool = tools[i % tools.length];
            String date = "2025-0" + (1 + (i % 6)) + "-" + (10 + (i % 15));

            AIUsage usage = AIUsage.builder()
                    .id("aiu-" + i)
                    .employeeId(empId)
                    .tool(tool)
                    .activeUsageDaysMonth(5 + rnd.nextInt(22))
                    .recordDate(date)
                    .build();
            aiUsageList.add(usage);
        }
        aiUsageRepository.saveAll(aiUsageList);

        // 7. Seed 50 FresherApprentice
        List<FresherApprentice> freshList = new ArrayList<>();
        String[] journeyStatuses = {
            "Campus Hiring", "Training Enrollment", "Training Completion",
            "Certification Completion", "Project Allocation", "Billable Deployment"
        };
        for (int i = 1; i <= 50; i++) {
            String empId = "emp-" + (i * 2); // subset of employees
            String status = journeyStatuses[i % journeyStatuses.length];
            String date = "2025-0" + (1 + (i % 4)) + "-" + (10 + (i % 15));

            FresherApprentice fa = FresherApprentice.builder()
                    .id("fa-" + i)
                    .employeeId(empId)
                    .hiringDate(date)
                    .status(status)
                    .timeToDeploymentDays(30 + rnd.nextInt(30))
                    .build();
            freshList.add(fa);
        }
        fresherApprenticeRepository.saveAll(freshList);

        System.out.println("Leadership Learning Analytics Mock Data seeded successfully!");
    }

    // Dynamic Filter Engine
    public FilteredDataSet filter(FilterParams params) {
        List<Employee> employees = employeeRepository.findAll();
        List<Training> trainings = trainingRepository.findAll();
        List<Session> sessions = sessionRepository.findAll();
        List<Nomination> nominations = nominationRepository.findAll();
        List<Certification> certifications = certificationRepository.findAll();
        List<AIUsage> aiUsages = aiUsageRepository.findAll();
        List<FresherApprentice> freshers = fresherApprenticeRepository.findAll();

        // 1. Filter employees by structural attributes
        List<Employee> filteredEmployees = employees.stream().filter(e -> {
            if (params.getRegion() != null && !params.getRegion().equalsIgnoreCase("All") && !e.getRegion().equalsIgnoreCase(params.getRegion())) return false;
            if (params.getLocation() != null && !params.getLocation().equalsIgnoreCase("All") && !e.getLocation().equalsIgnoreCase(params.getLocation())) return false;
            if (params.getBusinessUnit() != null && !params.getBusinessUnit().equalsIgnoreCase("All") && !e.getBusinessUnit().equalsIgnoreCase(params.getBusinessUnit())) return false;
            if (params.getDepartment() != null && !params.getDepartment().equalsIgnoreCase("All") && !e.getDepartment().equalsIgnoreCase(params.getDepartment())) return false;
            if (params.getProject() != null && !params.getProject().equalsIgnoreCase("All") && !e.getProject().equalsIgnoreCase(params.getProject())) return false;
            if (params.getPractice() != null && !params.getPractice().equalsIgnoreCase("All") && !e.getPractice().equalsIgnoreCase(params.getPractice())) return false;
            if (params.getEmployeeGrade() != null && !params.getEmployeeGrade().equalsIgnoreCase("All") && !e.getGrade().equalsIgnoreCase(params.getEmployeeGrade())) return false;
            if (params.getEmployeeId() != null && !params.getEmployeeId().isEmpty() && !e.getId().equalsIgnoreCase(params.getEmployeeId())) return false;
            return true;
        }).collect(Collectors.toList());

        Set<String> empIds = filteredEmployees.stream().map(Employee::getId).collect(Collectors.toSet());

        // 2. Filter other entities by employee membership
        List<Nomination> filteredNominations = nominations.stream().filter(n -> empIds.contains(n.getEmployeeId())).collect(Collectors.toList());
        List<Certification> filteredCertifications = certifications.stream().filter(c -> empIds.contains(c.getEmployeeId())).collect(Collectors.toList());
        List<AIUsage> filteredAIUsages = aiUsages.stream().filter(a -> empIds.contains(a.getEmployeeId())).collect(Collectors.toList());
        List<FresherApprentice> filteredFreshers = freshers.stream().filter(f -> empIds.contains(f.getEmployeeId())).collect(Collectors.toList());

        // 3. Filter all lists by Date Filters
        List<Employee> finalEmployees = filteredEmployees.stream().filter(e -> matchesDate(e.getCreatedAt(), params)).collect(Collectors.toList());
        List<Nomination> finalNominations = filteredNominations.stream().filter(n -> matchesDate(n.getNominatedDate(), params)).collect(Collectors.toList());
        List<Certification> finalCertifications = filteredCertifications.stream().filter(c -> matchesDate(c.getCompletionDate(), params)).collect(Collectors.toList());
        List<AIUsage> finalAIUsages = filteredAIUsages.stream().filter(a -> matchesDate(a.getRecordDate(), params)).collect(Collectors.toList());
        List<FresherApprentice> finalFreshers = filteredFreshers.stream().filter(f -> matchesDate(f.getHiringDate(), params)).collect(Collectors.toList());
        
        List<Session> finalSessions = sessions.stream().filter(s -> matchesDate(s.getSessionDate(), params)).collect(Collectors.toList());

        return new FilteredDataSet(finalEmployees, trainings, finalSessions, finalNominations, finalCertifications, finalAIUsages, finalFreshers);
    }

    private boolean matchesDate(String dateStr, FilterParams params) {
        if (dateStr == null || dateStr.isEmpty()) return true;
        if (params.getYear() != null && !params.getYear().equalsIgnoreCase("All") && !dateStr.startsWith(params.getYear())) {
            return false;
        }
        if (params.getQuarter() != null && !params.getQuarter().equalsIgnoreCase("All")) {
            String monthPart = dateStr.substring(5, 7);
            if (params.getQuarter().equalsIgnoreCase("Q1") && !(monthPart.equals("01") || monthPart.equals("02") || monthPart.equals("03"))) return false;
            if (params.getQuarter().equalsIgnoreCase("Q2") && !(monthPart.equals("04") || monthPart.equals("05") || monthPart.equals("06"))) return false;
            if (params.getQuarter().equalsIgnoreCase("Q3") && !(monthPart.equals("07") || monthPart.equals("08") || monthPart.equals("09"))) return false;
            if (params.getQuarter().equalsIgnoreCase("Q4") && !(monthPart.equals("10") || monthPart.equals("11") || monthPart.equals("12"))) return false;
        }
        if (params.getHalfYear() != null && !params.getHalfYear().equalsIgnoreCase("All")) {
            String monthPart = dateStr.substring(5, 7);
            int m = Integer.parseInt(monthPart);
            if (params.getHalfYear().equalsIgnoreCase("H1") && m > 6) return false;
            if (params.getHalfYear().equalsIgnoreCase("H2") && m <= 6) return false;
        }
        if (params.getMonth() != null && !params.getMonth().equalsIgnoreCase("All")) {
            String monthPart = dateStr.substring(5, 7);
            String targetMonth = getMonthDigits(params.getMonth());
            if (!monthPart.equals(targetMonth)) return false;
        }
        if (params.getStartDate() != null && !params.getStartDate().isEmpty()) {
            if (dateStr.compareTo(params.getStartDate()) < 0) return false;
        }
        if (params.getEndDate() != null && !params.getEndDate().isEmpty()) {
            if (dateStr.compareTo(params.getEndDate()) > 0) return false;
        }
        return true;
    }

    private String getMonthDigits(String monthName) {
        switch (monthName.toLowerCase()) {
            case "january": return "01";
            case "february": return "02";
            case "march": return "03";
            case "april": return "04";
            case "may": return "05";
            case "june": return "06";
            case "july": return "07";
            case "august": return "08";
            case "september": return "09";
            case "october": return "10";
            case "november": return "11";
            case "december": return "12";
            default: return "01";
        }
    }

    // Helper static class to wrap filtered dataset
    public static class FilteredDataSet {
        public final List<Employee> employees;
        public final List<Training> trainings;
        public final List<Session> sessions;
        public final List<Nomination> nominations;
        public final List<Certification> certifications;
        public final List<AIUsage> aiUsages;
        public final List<FresherApprentice> freshers;

        public FilteredDataSet(List<Employee> employees, List<Training> trainings, List<Session> sessions,
                               List<Nomination> nominations, List<Certification> certifications,
                               List<AIUsage> aiUsages, List<FresherApprentice> freshers) {
            this.employees = employees;
            this.trainings = trainings;
            this.sessions = sessions;
            this.nominations = nominations;
            this.certifications = certifications;
            this.aiUsages = aiUsages;
            this.freshers = freshers;
        }
    }
}
