package com.rtps.platform.repository;

import com.rtps.platform.entity.Certification;
import com.rtps.platform.entity.enums.CertificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByStudentProfileId(Long studentProfileId);
    List<Certification> findByStudentProfileIdAndStatus(Long studentProfileId, CertificationStatus status);
    List<Certification> findByStatus(CertificationStatus status);

    long countByStudentProfileId(Long studentProfileId);
    long countByStudentProfileIdAndStatus(Long studentProfileId, CertificationStatus status);
    long countByStatus(CertificationStatus status);

    @Query("SELECT c FROM Certification c WHERE c.studentProfile.id = :studentId AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:query IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.issuingOrganization) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Certification> searchCertifications(
            @Param("studentId") Long studentId,
            @Param("status") CertificationStatus status,
            @Param("query") String query);

    @Query("SELECT c FROM Certification c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:query IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.issuingOrganization) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.studentProfile.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Certification> searchAllCertifications(
            @Param("status") CertificationStatus status,
            @Param("query") String query);

    List<Certification> findByExpiryDateBeforeAndStatus(LocalDate date, CertificationStatus status);
}
