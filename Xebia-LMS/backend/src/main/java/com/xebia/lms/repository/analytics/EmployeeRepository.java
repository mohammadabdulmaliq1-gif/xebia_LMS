package com.xebia.lms.repository.analytics;

import com.xebia.lms.model.analytics.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
}
