package com.grievanceconnect.grievanceconnect.service.impl;

import com.grievanceconnect.grievanceconnect.dto.request.CreateUserRequest;
import com.grievanceconnect.grievanceconnect.entity.Department;
import com.grievanceconnect.grievanceconnect.entity.Role;
import com.grievanceconnect.grievanceconnect.entity.User;
import com.grievanceconnect.grievanceconnect.enums.RoleName;
import com.grievanceconnect.grievanceconnect.repository.DepartmentRepository;
import com.grievanceconnect.grievanceconnect.repository.RoleRepository;
import com.grievanceconnect.grievanceconnect.repository.UserRepository;
import com.grievanceconnect.grievanceconnect.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @Override
    public String createUser(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByRoleName(
                RoleName.valueOf(request.getRole().toUpperCase())
        ).orElseThrow(() -> new RuntimeException("Role not found"));

        Department department = null;

        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(
                    request.getDepartmentId()
            ).orElseThrow(() ->
                    new RuntimeException("Department not found"));
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .registerNumber(request.getRegisterNumber())
                .employeeId(request.getEmployeeId())
                .role(role)
                .department(department)
                .active(true)
                .build();

        userRepository.save(user);

        return "User created successfully";
    }
}