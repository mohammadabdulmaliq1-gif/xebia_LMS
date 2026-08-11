package com.xebia.lms.controller;

import com.xebia.lms.model.Content;
import com.xebia.lms.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ContentController {

    @Autowired
    private ContentRepository contentRepository;

    @GetMapping("/submodules/{submoduleId}/contents")
    public List<Content> getContents(@PathVariable String submoduleId) {
        return contentRepository.findBySubmoduleIdOrderByOrderAsc(submoduleId);
    }

    @PostMapping("/contents")
    public Content createContent(@RequestBody Content content) {
        if (content.getId() == null || content.getId().isEmpty()) {
            content.setId("cont-" + System.currentTimeMillis());
        }
        if (content.getOrder() == null) {
            long count = contentRepository.countBySubmoduleId(content.getSubmoduleId());
            content.setOrder((int) count + 1);
        }
        return contentRepository.save(content);
    }

    @PutMapping("/contents/{id}")
    public ResponseEntity<Content> updateContent(@PathVariable String id, @RequestBody Content details) {
        return contentRepository.findById(id)
                .map(existing -> {
                    if (details.getTitle() != null) existing.setTitle(details.getTitle());
                    if (details.getType() != null) existing.setType(details.getType());
                    if (details.getBody() != null) existing.setBody(details.getBody());
                    if (details.getOrder() != null) existing.setOrder(details.getOrder());
                    if (details.getSubmoduleId() != null) existing.setSubmoduleId(details.getSubmoduleId());
                    if (details.getStatus() != null) existing.setStatus(details.getStatus());
                    return ResponseEntity.ok(contentRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/contents/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable String id) {
        if (contentRepository.existsById(id)) {
            contentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/submodules/{submoduleId}/contents/reorder")
    public List<Content> reorderContents(@PathVariable String submoduleId, @RequestBody ReorderRequest request) {
        List<String> orderedIds = request.getOrderedIds();
        if (orderedIds != null && !orderedIds.isEmpty()) {
            for (int i = 0; i < orderedIds.size(); i++) {
                String id = orderedIds.get(i);
                int newOrder = i + 1;
                Optional<Content> contentOpt = contentRepository.findById(id);
                if (contentOpt.isPresent()) {
                    Content content = contentOpt.get();
                    if (content.getSubmoduleId().equals(submoduleId)) {
                        content.setOrder(newOrder);
                        contentRepository.save(content);
                    }
                }
            }
        }
        return contentRepository.findBySubmoduleIdOrderByOrderAsc(submoduleId);
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
