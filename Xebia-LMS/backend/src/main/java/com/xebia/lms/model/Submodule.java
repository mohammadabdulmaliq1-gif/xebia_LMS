package com.xebia.lms.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "submodules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Submodule {

    @Id
    private String id;

    @Column(name = "module_id", nullable = false)
    private String moduleId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String slug;

    @Column(name = "sort_order")
    private Integer order;

    @Builder.Default
    private String duration = "15 min";

    @Column(name = "pdf_url", length = 1000)
    private String pdfUrl;

    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "video_url", length = 1000)
    private String videoUrl;
}
