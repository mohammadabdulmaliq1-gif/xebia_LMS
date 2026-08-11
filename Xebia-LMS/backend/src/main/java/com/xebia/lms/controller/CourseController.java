package com.xebia.lms.controller;

import com.xebia.lms.model.Category;
import com.xebia.lms.model.Course;
import com.xebia.lms.repository.CategoryRepository;
import com.xebia.lms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Course> getCourses(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "categoryId", required = false) String categoryId,
            @RequestParam(value = "level", required = false) String level) {
        return courseRepository.findCoursesWithFilters(search, categoryId, level);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Course> getCourseBySlug(@PathVariable String slug) {
        return courseRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        if (course.getId() == null || course.getId().isEmpty()) {
            course.setId("course-" + System.currentTimeMillis());
        }
        if (course.getSlug() == null || course.getSlug().isEmpty()) {
            course.setSlug(course.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }

        Course savedCourse = courseRepository.save(course);

        // Increment category coursesCount
        if (course.getCategoryId() != null) {
            categoryRepository.findById(course.getCategoryId()).ifPresent(category -> {
                category.setCoursesCount(category.getCoursesCount() + 1);
                categoryRepository.save(category);
            });
        }

        return savedCourse;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course details) {
        return courseRepository.findById(id)
                .map(existing -> {
                    // Save previous category to handle changes
                    String oldCategoryId = existing.getCategoryId();

                    if (details.getTitle() != null) existing.setTitle(details.getTitle());
                    if (details.getDescription() != null) existing.setDescription(details.getDescription());
                    if (details.getLevel() != null) existing.setLevel(details.getLevel());
                    if (details.getDuration() != null) existing.setDuration(details.getDuration());
                    if (details.getLanguage() != null) existing.setLanguage(details.getLanguage());
                    if (details.getThumbnail() != null) existing.setThumbnail(details.getThumbnail());
                    if (details.getBanner() != null) existing.setBanner(details.getBanner());
                    if (details.getSeoTitle() != null) existing.setSeoTitle(details.getSeoTitle());
                    if (details.getSeoDescription() != null) existing.setSeoDescription(details.getSeoDescription());
                    if (details.getCategoryId() != null) existing.setCategoryId(details.getCategoryId());
                    if (details.getPdfUrl() != null) existing.setPdfUrl(details.getPdfUrl());
                    if (details.getSlug() != null && !details.getSlug().isEmpty()) {
                        existing.setSlug(details.getSlug());
                    }
                    if (details.getStatus() != null) {
                        existing.setStatus(details.getStatus());
                    }

                    Course updatedCourse = courseRepository.save(existing);

                    // Update category coursesCount if category changed
                    if (details.getCategoryId() != null && !details.getCategoryId().equals(oldCategoryId)) {
                        // Decrement old
                        if (oldCategoryId != null) {
                            categoryRepository.findById(oldCategoryId).ifPresent(cat -> {
                                cat.setCoursesCount(Math.max(0, cat.getCoursesCount() - 1));
                                categoryRepository.save(cat);
                            });
                        }
                        // Increment new
                        categoryRepository.findById(details.getCategoryId()).ifPresent(cat -> {
                            cat.setCoursesCount(cat.getCoursesCount() + 1);
                            categoryRepository.save(cat);
                        });
                    }

                    return ResponseEntity.ok(updatedCourse);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        return courseRepository.findById(id)
                .map(course -> {
                    courseRepository.delete(course);

                    // Decrement category coursesCount
                    if (course.getCategoryId() != null) {
                        categoryRepository.findById(course.getCategoryId()).ifPresent(category -> {
                            category.setCoursesCount(Math.max(0, category.getCoursesCount() - 1));
                            categoryRepository.save(category);
                        });
                    }

                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
