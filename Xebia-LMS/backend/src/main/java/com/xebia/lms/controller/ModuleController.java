package com.xebia.lms.controller;

import com.xebia.lms.model.Module;
import com.xebia.lms.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ModuleController {

    @Autowired
    private ModuleRepository moduleRepository;

    @GetMapping("/courses/{courseId}/modules")
    public List<Module> getModules(@PathVariable String courseId) {
        return moduleRepository.findByCourseIdOrderByOrderAsc(courseId);
    }

    @PostMapping("/modules")
    public Module createModule(@RequestBody Module module) {
        if (module.getId() == null || module.getId().isEmpty()) {
            module.setId("mod-" + System.currentTimeMillis());
        }
        if (module.getOrder() == null) {
            long count = moduleRepository.countByCourseId(module.getCourseId());
            module.setOrder((int) count + 1);
        }
        return moduleRepository.save(module);
    }

    @PutMapping("/modules/{id}")
    public ResponseEntity<Module> updateModule(@PathVariable String id, @RequestBody Module details) {
        return moduleRepository.findById(id)
                .map(existing -> {
                    if (details.getTitle() != null) existing.setTitle(details.getTitle());
                    if (details.getOrder() != null) existing.setOrder(details.getOrder());
                    if (details.getCourseId() != null) existing.setCourseId(details.getCourseId());
                    if (details.getPdfUrl() != null) existing.setPdfUrl(details.getPdfUrl());
                    if (details.getVideoUrl() != null) existing.setVideoUrl(details.getVideoUrl());
                    if (details.getStatus() != null) existing.setStatus(details.getStatus());
                    return ResponseEntity.ok(moduleRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/modules/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable String id) {
        if (moduleRepository.existsById(id)) {
            moduleRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/courses/{courseId}/modules/reorder")
    public List<Module> reorderModules(@PathVariable String courseId, @RequestBody ReorderRequest request) {
        List<String> orderedIds = request.getOrderedIds();
        if (orderedIds != null && !orderedIds.isEmpty()) {
            for (int i = 0; i < orderedIds.size(); i++) {
                String id = orderedIds.get(i);
                int newOrder = i + 1;
                Optional<Module> moduleOpt = moduleRepository.findById(id);
                if (moduleOpt.isPresent()) {
                    Module module = moduleOpt.get();
                    if (module.getCourseId().equals(courseId)) {
                        module.setOrder(newOrder);
                        moduleRepository.save(module);
                    }
                }
            }
        }
        return moduleRepository.findByCourseIdOrderByOrderAsc(courseId);
    }

    public static class ReorderRequest {
        private List<String> orderedIds;

        public List<String> getOrderedIds() {
            return orderedIds;
        }

        public void setOrderedIds(List<String> orderedIds) {
            this.orderedIds = orderedIds;
        }
    }
}
