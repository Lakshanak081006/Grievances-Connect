package com.grievanceconnect.grievanceconnect.repository;

import com.grievanceconnect.grievanceconnect.entity.Grievance;
import com.grievanceconnect.grievanceconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    List<Grievance> findByCreatedBy(User user);

    List<Grievance> findByCurrentHandler(User user);
}