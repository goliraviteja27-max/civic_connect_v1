package com.civicconnect;
public class CategoryMatcher {

    public static String findCategory(String description) {

        String text = description.toLowerCase();

        // Streetlight
        if (text.contains("streetlight")
                || text.contains("street light")
                || text.contains("lamp")
                || text.contains("light not working")) {

            return "Streetlight";
        }

        // Garbage
        if (text.contains("garbage")
                || text.contains("waste")
                || text.contains("trash")
                || text.contains("dumping")) {

            return "Garbage";
        }

        // Pothole / damaged road
        if (text.contains("pothole")
                || text.contains("road hole")
                || text.contains("damaged road")
                || text.contains("road damage")) {

            return "Pothole";
        }

        // Drainage / waterlogging
        if (text.contains("drainage")
                || text.contains("waterlogging")
                || text.contains("water logging")
                || text.contains("flooding")) {

            return "Drainage";
        }

        // Footpath
        if (text.contains("footpath")
                || text.contains("sidewalk")
                || text.contains("pavement")) {

            return "Broken Footpath";
        }

        // Road signs
        if (text.contains("road sign")
                || text.contains("traffic sign")
                || text.contains("sign board")) {

            return "Road Sign";
        }

        // Water supply
        if (text.contains("water supply")
                || text.contains("no water")
                || text.contains("water shortage")
                || text.contains("water problem")) {

            return "Water Supply";
        }

        // Sewage
        if (text.contains("sewage")
                || text.contains("sewer")
                || text.contains("sewer overflow")) {

            return "Sewage";
        }

        // Stray animals
        if (text.contains("stray dog")
                || text.contains("stray animal")
                || text.contains("street dog")) {

            return "Stray Animals";
        }

        // Public toilet
        if (text.contains("public toilet")
                || text.contains("toilet problem")
                || text.contains("toilet")) {

            return "Public Toilet";
        }

        // Fallen tree
        if (text.contains("fallen tree")
                || text.contains("tree fallen")
                || text.contains("dangerous branch")) {

            return "Fallen Tree";
        }

        // Open manhole
        if (text.contains("open manhole")
                || text.contains("manhole")
                || text.contains("man hole")) {

            return "Open Manhole";
        }

        // Encroachment
        if (text.contains("encroachment")
                || text.contains("illegal construction")) {

            return "Encroachment";
        }

        // Park
        if (text.contains("park")
                || text.contains("park maintenance")) {

            return "Park Maintenance";
        }

        // No matching category
        return "Other";
    }
}