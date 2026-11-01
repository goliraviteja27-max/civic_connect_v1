
package com.civicconnect;

import org.springframework.stereotype.Component;

@Component
public class DepartmentRouter {

    private final DepartmentRepository departmentRepository;

    public DepartmentRouter(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department findDepartment(String category) {

        String departmentName = findDepartmentName(category);

        return departmentRepository.findByName(departmentName)
                .orElseThrow(() -> new IllegalStateException(
                        "Department not found in database: " + departmentName
                ));
    }

    private String findDepartmentName(String category) {

        if (category == null) {
            return "General Municipal Department";
        }

        switch (category) {
            case "Streetlight":
                return "Electrical Department";

            case "Garbage":
            case "Public Toilet":
                return "Sanitation Department";

            case "Pothole":
            case "Broken Footpath":
            case "Road Sign":
                return "Roads Department";

            case "Drainage":
            case "Open Manhole":
                return "Drainage Department";

            case "Water Supply":
                return "Water Supply Department";

            case "Sewage":
                return "Sewerage Department";

            case "Stray Animals":
                return "Animal Control Department";

            case "Fallen Tree":
            case "Park Maintenance":
                return "Parks and Horticulture Department";

            case "Encroachment":
                return "Municipal Enforcement Department";

            default:
                return "General Municipal Department";
        }
    }
}
