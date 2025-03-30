/**
 * Flatfile configuration
 * This file contains the field definitions for Flatfile data mapping
 */

export const flatfileBlueprint = {
  "name": "Route Data",
  "slug": "route-data",
  "fields": [
    {
      "key": "location",
      "label": "Location Name",
      "description": "Name of the location"
    },
    {
      "key": "address",
      "label": "Address",
      "description": "Full address of the location"
    },
    {
      "key": "latitude",
      "label": "Latitude",
      "description": "GPS latitude coordinate"
    },
    {
      "key": "longitude",
      "label": "Longitude",
      "description": "GPS longitude coordinate"
    },
    {
      "key": "timeWindowStart",
      "label": "Time Window Start",
      "description": "Start of delivery window (optional)"
    },
    {
      "key": "timeWindowEnd",
      "label": "Time Window End",
      "description": "End of delivery window (optional)"
    },
    {
      "key": "duration",
      "label": "Duration",
      "description": "Expected duration at location in minutes (optional)"
    }
  ]
}; 