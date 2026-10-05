package com.rtps.platform.dto.request;

import com.rtps.platform.entity.enums.SkillLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

public class CareerRoleRequest {

    @NotBlank(message = "Career title is required")
    @Size(max = 100, message = "Career title cannot exceed 100 characters")
    private String title;

    private String description;
    private String departmentFocus;

    private List<RequiredSkillItem> requiredSkills = new ArrayList<>();

    public static class RequiredSkillItem {
        private Long skillMasterId;
        private SkillLevel minimumLevel = SkillLevel.INTERMEDIATE;
        private int weight = 5;

        public RequiredSkillItem() {}

        public RequiredSkillItem(Long skillMasterId, SkillLevel minimumLevel, int weight) {
            this.skillMasterId = skillMasterId;
            this.minimumLevel = minimumLevel;
            this.weight = weight;
        }

        public Long getSkillMasterId() {
            return skillMasterId;
        }

        public void setSkillMasterId(Long skillMasterId) {
            this.skillMasterId = skillMasterId;
        }

        public SkillLevel getMinimumLevel() {
            return minimumLevel;
        }

        public void setMinimumLevel(SkillLevel minimumLevel) {
            this.minimumLevel = minimumLevel;
        }

        public int getWeight() {
            return weight;
        }

        public void setWeight(int weight) {
            this.weight = weight;
        }
    }

    public CareerRoleRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDepartmentFocus() {
        return departmentFocus;
    }

    public void setDepartmentFocus(String departmentFocus) {
        this.departmentFocus = departmentFocus;
    }

    public List<RequiredSkillItem> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<RequiredSkillItem> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
}
