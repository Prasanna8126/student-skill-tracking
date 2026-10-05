package com.rtps.platform.controller;

import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.CareerRequiredSkillDto;
import com.rtps.platform.dto.response.CareerRoleDto;
import com.rtps.platform.service.CareerRoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/careers")
public class CareerRoleController {

    private final CareerRoleService careerRoleService;

    public CareerRoleController(CareerRoleService careerRoleService) {
        this.careerRoleService = careerRoleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CareerRoleDto>>> getAllCareers() {
        List<CareerRoleDto> roles = careerRoleService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.ok("Career roles retrieved", roles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CareerRoleDto>> getCareerById(@PathVariable Long id) {
        CareerRoleDto role = careerRoleService.getRoleById(id);
        return ResponseEntity.ok(ApiResponse.ok("Career role details", role));
    }

    @GetMapping("/{id}/skills")
    public ResponseEntity<ApiResponse<List<CareerRequiredSkillDto>>> getCareerRequiredSkills(@PathVariable Long id) {
        CareerRoleDto role = careerRoleService.getRoleById(id);
        return ResponseEntity.ok(ApiResponse.ok("Career required skills", role.getRequiredSkills()));
    }
}
