import h3
import numpy as np
import csv
import random

def get_h3_indexes_for_bbox(bbox, resolution=13):
    """
    Fill bounding box with H3 hexagons.
    :param bbox: List of bounding box coordinates in the format [[lon1, lat1], [lon2, lat2], ...]
    :param resolution: H3 resolution (0-15)
    :return: List of H3 indexes
    """
    # Extract min and max lat/lng values
    lats = [coord[1] for coord in bbox]
    lngs = [coord[0] for coord in bbox]

    min_lat, max_lat = np.min(lats), np.max(lats)
    min_lng, max_lng = np.min(lngs), np.max(lngs)

    # Start from a corner and move across and up/down to cover the bounding box
    hexagons = set()
    lat_step, lng_step = 0.0001, 0.0001  # Small step values to ensure coverage

    lat, lng = min_lat, min_lng
    while lat <= max_lat:
        while lng <= max_lng:
            print("trigger")
            # Convert (lat, lng) to H3 index and add to the set
            h = h3.geo_to_h3(lat, lng, resolution)
            hexagons.add(h)
            lng += lng_step
        lat += lat_step
        lng = min_lng  # Reset lng for next row

    return list(hexagons)



def write_hexagons_to_csv(hexagons, filename="h3_cells.csv"):
    """
    Write hexagons and their random counts to a CSV file.
    :param hexagons: List of H3 indexes
    :param filename: Name of the output CSV file
    """
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["H3_Index", "Count"])  # header
        for hexagon in hexagons:
            print(hexagon)
            count = random.randint(1, 1000)  # Generate a random count between 1 and 100
            writer.writerow([hexagon, count])

bbox = [[-125.0532049122,34.3253254368],[-116.0631447543,34.3253254368],[-116.0631447543,44.5909874911],[-125.0532049122,44.5909874911],[-125.0532049122,34.3253254368]]
hexes = get_h3_indexes_for_bbox(bbox, resolution=13)
write_hexagons_to_csv(hexes)

print(f"Data written to h3_cells.csv")

print(hexes)
print(f"Number of H3 cells: {len(hexes)}")
