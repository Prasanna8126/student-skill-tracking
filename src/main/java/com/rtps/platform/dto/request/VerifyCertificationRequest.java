package com.rtps.platform.dto.request;

import com.rtps.platform.entity.enums.CertificationStatus;
import jakarta.validation.constraints.NotNull;

public class VerifyCertificationRequest {

    @NotNull(message = "Status is required (VERIFIED or REJECTED)")
    private CertificationStatus status;

    private String adminFeedback;

    public VerifyCertificationRequest() {
    }

    public VerifyCertificationRequest(CertificationStatus status, String adminFeedback) {
        this.status = status;
        this.adminFeedback = adminFeedback;
    }

    public CertificationStatus getStatus() {
        return status;
    }

    public void setStatus(CertificationStatus status) {
        this.status = status;
    }

    public String getAdminFeedback() {
        return adminFeedback;
    }

    public void setAdminFeedback(String adminFeedback) {
        this.adminFeedback = adminFeedback;
    }
}
