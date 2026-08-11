package com.xebia.lms.controller;

import com.xebia.lms.model.Submodule;
import com.xebia.lms.repository.SubmoduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class SubmoduleController {

    @Autowired
    private SubmoduleRepository submoduleRepository;

    @GetMapping("/modules/{moduleId}/submodules")
    public List<Submodule> getSubmodules(@PathVariable String moduleId) {
        return submoduleRepository.findByModuleIdOrderByOrderAsc(moduleId);
    }

    @GetMapping("/courses/{courseSlug}/learn/{submoduleSlug}")
    public ResponseEntity<Submodule> getSubmoduleByCourseAndSubmoduleSlug(
            @PathVariable String courseSlug,
            @PathVariable String submoduleSlug) {
        return submoduleRepository.findByCourseSlugAndSubmoduleSlug(courseSlug, submoduleSlug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/submodules")
    public Submodule createSubmodule(@RequestBody Submodule submodule) {
        if (submodule.getId() == null || submodule.getId().isEmpty()) {
            submodule.setId("submod-" + System.currentTimeMillis());
        }
        if (submodule.getSlug() == null || submodule.getSlug().isEmpty()) {
            submodule.setSlug(submodule.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        if (submodule.getOrder() == null) {
            long count = submoduleRepository.countByModuleId(submodule.getModuleId());
            submodule.setOrder((int) count + 1);
        }
        if (submodule.getDuration() == null || submodule.getDuration().isEmpty()) {
            submodule.setDuration("15 min");
        }
        return submoduleRepository.save(submodule);
    }

    @PutMapping("/submodules/{id}")
    public ResponseEntity<Submodule> updateSubmodule(@PathVariable String id, @RequestBody Submodule details) {
        return submoduleRepository.findById(id)
                .map(existing -> {
                    if (details.getTitle() != null) existing.setTitle(details.getTitle());
                    if (details.getSlug() != null && !details.getSlug().isEmpty()) {
                        existing.setSlug(details.getSlug());
                    }
                    if (details.getOrder() != null) existing.setOrder(details.getOrder());
                    if (details.getDuration() != null) existing.setDuration(details.getDuration());
                    if (details.getModuleId() != null) existing.setModuleId(details.getModuleId());
                    if (details.getPdfUrl() != null) existing.setPdfUrl(details.getPdfUrl());
                    if (details.getVideoUrl() != null) existing.setVideoUrl(details.getVideoUrl());
                    if (details.getStatus() != null) existing.setStatus(details.getStatus());
                    return ResponseEntity.ok(submoduleRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/submodules/{id}")
    public ResponseEntity<Void> deleteSubmodule(@PathVariable String id) {
        if (submoduleRepository.existsById(id)) {
            submoduleRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/modules/{moduleId}/submodules/reorder")
    public List<Submodule> reorderSubmodules(@PathVariable String moduleId, @RequestBody ReorderRequest request) {
        List<String> orderedIds = request.getOrderedIds();
        if (orderedIds != null && !orderedIds.isEmpty()) {
            for (int i = 0; i < orderedIds.size(); i++) {
                String id = orderedIds.get(i);
                int newOrder = i + 1;
                Optional<Submodule> submoduleOpt = submoduleRepository.findById(id);
                if (submoduleOpt.isPresent()) {
                    Submodule submodule = submoduleOpt.get();
                    if (submodule.getModuleId().equals(moduleId)) {
                        submodule.setOrder(newOrder);
                        submoduleRepository.save(submodule);
                    }
                }
            }
        }
        return submoduleRepository.findByModuleIdOrderByOrderAsc(moduleId);
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
