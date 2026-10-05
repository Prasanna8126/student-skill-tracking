package com.rtps.platform.service;

import com.rtps.platform.dto.request.CertificationRequest;
import com.rtps.platform.dto.request.VerifyCertificationRequest;
import com.rtps.platform.dto.response.CertificationDto;
import com.rtps.platform.entity.Certification;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.enums.CertificationStatus;
import com.rtps.platform.entity.enums.NotificationType;
import com.rtps.platform.exception.BadRequestException;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.CertificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final NotificationService notificationService;

    public CertificationService(CertificationRepository certificationRepository,
                                NotificationService notificationService) {
        this.certificationRepository = certificationRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public List<CertificationDto> getStudentCertifications(Long studentProfileId, CertificationStatus status, String query) {
        checkAndMarkExpiredCertifications();

        String q = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return certificationRepository.searchCertifications(studentProfileId, status, q)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<CertificationDto> getAllCertifications(CertificationStatus status, String query) {
        checkAndMarkExpiredCertifications();

        String q = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return certificationRepository.searchAllCertifications(status, q)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CertificationDto addCertification(StudentProfile profile, CertificationRequest request) {
        if (request.getExpiryDate() != null && request.getExpiryDate().isBefore(request.getIssueDate())) {
            throw new BadRequestException("Expiry date cannot be earlier than the issue date.");
        }

        Certification cert = new Certification(
                profile,
                request.getTitle().trim(),
                request.getIssuingOrganization().trim(),
                request.getCertificateId() != null ? request.getCertificateId().trim() : null,
                request.getIssueDate(),
                request.getExpiryDate(),
                request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null,
                request.getCertificateFilePath() != null ? request.getCertificateFilePath().trim() : null
        );

        if (request.getExpiryDate() != null && request.getExpiryDate().isBefore(LocalDate.now())) {
            cert.setStatus(CertificationStatus.EXPIRED);
        } else {
            cert.setStatus(CertificationStatus.PENDING);
        }

        Certification saved = certificationRepository.save(cert);
        return mapToDto(saved);
    }

    @Transactional
    public CertificationDto updateCertification(StudentProfile profile, Long certId, CertificationRequest request) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + certId));

        if (!cert.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to update this certification.");
        }

        if (request.getExpiryDate() != null && request.getExpiryDate().isBefore(request.getIssueDate())) {
            throw new BadRequestException("Expiry date cannot be earlier than the issue date.");
        }

        cert.setTitle(request.getTitle().trim());
        cert.setIssuingOrganization(request.getIssuingOrganization().trim());
        cert.setCertificateId(request.getCertificateId() != null ? request.getCertificateId().trim() : null);
        cert.setIssueDate(request.getIssueDate());
        cert.setExpiryDate(request.getExpiryDate());
        cert.setCredentialUrl(request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null);
        if (request.getCertificateFilePath() != null) {
            cert.setCertificateFilePath(request.getCertificateFilePath().trim());
        }

        // If previously verified or rejected, editing resets to pending
        if (cert.getStatus() == CertificationStatus.REJECTED) {
            cert.setStatus(CertificationStatus.PENDING);
            cert.setAdminFeedback(null);
        }

        Certification updated = certificationRepository.save(cert);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteCertification(StudentProfile profile, Long certId) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + certId));

        if (!cert.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to delete this certification.");
        }

        certificationRepository.delete(cert);
    }

    @Transactional
    public CertificationDto verifyCertification(Long certId, VerifyCertificationRequest request) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + certId));

        cert.setStatus(request.getStatus());
        cert.setAdminFeedback(request.getAdminFeedback());
        if (request.getStatus() == CertificationStatus.VERIFIED) {
            cert.setVerifiedAt(LocalDateTime.now());
        }

        Certification saved = certificationRepository.save(cert);

        // Notify student
        String title = request.getStatus() == CertificationStatus.VERIFIED
                ? "Certification Verified!"
                : "Certification Review Update";
        String message = request.getStatus() == CertificationStatus.VERIFIED
                ? "Congratulations! Your certification '" + cert.getTitle() + "' issued by " + cert.getIssuingOrganization() + " has been verified."
                : "Your certification '" + cert.getTitle() + "' was not approved. Feedback: " + (request.getAdminFeedback() != null ? request.getAdminFeedback() : "Please review details.");
        NotificationType notifType = request.getStatus() == CertificationStatus.VERIFIED
                ? NotificationType.SUCCESS
                : NotificationType.WARNING;

        notificationService.createNotification(cert.getStudentProfile().getUser(), title, message, notifType);

        return mapToDto(saved);
    }

    @Transactional
    public void checkAndMarkExpiredCertifications() {
        List<Certification> expiredCerts = certificationRepository.findByExpiryDateBeforeAndStatus(
                LocalDate.now(), CertificationStatus.VERIFIED);
        for (Certification cert : expiredCerts) {
            cert.setStatus(CertificationStatus.EXPIRED);
            certificationRepository.save(cert);
            notificationService.createNotification(
                    cert.getStudentProfile().getUser(),
                    "Certification Expired",
                    "Your certification '" + cert.getTitle() + "' expired on " + cert.getExpiryDate() + ".",
                    NotificationType.ALERT
            );
        }
    }

    public CertificationDto mapToDto(Certification c) {
        CertificationDto dto = new CertificationDto();
        dto.setId(c.getId());
        dto.setStudentProfileId(c.getStudentProfile().getId());
        dto.setStudentName(c.getStudentProfile().getUser().getFullName());
        dto.setStudentEmail(c.getStudentProfile().getUser().getEmail());
        dto.setStudentId(c.getStudentProfile().getStudentId());
        dto.setTitle(c.getTitle());
        dto.setIssuingOrganization(c.getIssuingOrganization());
        dto.setCertificateId(c.getCertificateId());
        dto.setIssueDate(c.getIssueDate());
        dto.setExpiryDate(c.getExpiryDate());
        dto.setCredentialUrl(c.getCredentialUrl());
        dto.setCertificateFilePath(c.getCertificateFilePath());
        dto.setStatus(c.getStatus());
        dto.setAdminFeedback(c.getAdminFeedback());
        dto.setVerifiedAt(c.getVerifiedAt());
        return dto;
    }
}
