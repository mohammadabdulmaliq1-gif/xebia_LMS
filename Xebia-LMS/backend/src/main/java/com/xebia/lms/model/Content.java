package com.xebia.lms.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Content {

    @Id
    private String id;

    @Column(name = "submodule_id", nullable = false)
    private String submoduleId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type; // heading, text, callout, code, table, video, image

    @Lob
    @Column(name = "body")
    private String body; // Stores serialized JSON string of the block content

    @Column(name = "sort_order")
    private Integer order;

    @Builder.Default
    private String status = "PUBLISHED";
}
