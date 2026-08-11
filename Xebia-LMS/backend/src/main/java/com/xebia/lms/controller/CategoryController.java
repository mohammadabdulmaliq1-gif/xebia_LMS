package com.xebia.lms.controller;

import com.xebia.lms.model.Category;
import com.xebia.lms.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Category> getCategoryBySlug(@PathVariable String slug) {
        return categoryRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        if (category.getId() == null || category.getId().isEmpty()) {
            category.setId("cat-" + System.currentTimeMillis());
        }
        if (category.getSlug() == null || category.getSlug().isEmpty()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        if (category.getCoursesCount() == null) {
            category.setCoursesCount(0);
        }
        return categoryRepository.save(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable String id, @RequestBody Category details) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    if (details.getName() != null) existing.setName(details.getName());
                    if (details.getDescription() != null) existing.setDescription(details.getDescription());
                    if (details.getIcon() != null) existing.setIcon(details.getIcon());
                    if (details.getSlug() != null && !details.getSlug().isEmpty()) {
                        existing.setSlug(details.getSlug());
                    }
                    if (details.getCoursesCount() != null) {
                        existing.setCoursesCount(details.getCoursesCount());
                    }
                    if (details.getPdfUrl() != null) {
                        existing.setPdfUrl(details.getPdfUrl());
                    }
                    if (details.getStatus() != null) {
                        existing.setStatus(details.getStatus());
                    }
                    if (details.getImageUrl() != null) {
                        existing.setImageUrl(details.getImageUrl());
                    }
                    if (details.getColor() != null) {
                        existing.setColor(details.getColor());
                    }
                    return ResponseEntity.ok(categoryRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
