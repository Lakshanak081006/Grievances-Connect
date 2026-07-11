package com.grievanceconnect.grievanceconnect.service;
import com.grievanceconnect.grievanceconnect.entity.User;
import java.util.List;
import com.grievanceconnect.grievanceconnect.dto.request.CreateUserRequest;

public interface UserService {
    List<User> getAllUsers();
    String createUser(CreateUserRequest request);
}