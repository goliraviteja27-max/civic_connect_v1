package com.civicconnect;

public class PriorityEngine {

    public static String calculatePriority(String description, String category) {

        String text = description.toLowerCase();

        // HIGH priority conditions
        if (text.contains("danger")
                || text.contains("accident")
                || text.contains("fire")
                || text.contains("open manhole")
                || text.contains("flooding")
                || text.contains("electric shock")
                || text.contains("live wire")
                || category.equals("Open Manhole")) {

            return "HIGH";
        }

        // MEDIUM priority conditions
        if (category.equals("Pothole")
                || category.equals("Drainage")
                || category.equals("Streetlight")
                || category.equals("Sewage")
                || category.equals("Broken Footpath")
                || category.equals("Water Supply")) {

            return "MEDIUM";
        }

        // LOW priority for other issues
        return "LOW";
    }
}
