const moment = require("moment");
const Station = require("../../models/station");
const { normalizeFare, normalizeFareType, readCSV } = require("./utils");

const importFile = async ({ file, effectiveDate }) => {
  try {
    const data = await readCSV(file);
    const destinations = data[0];
    const fareGroups = data.slice(1);
    const fareObjects = createFareObjects(fareGroups, destinations);

    // save stations to database with destination zones and fares

    const newStationPromises = stations.map(station => {
      const destinationAndFareObject = fareObjects.find(
        obj => obj.origin === station.fareZone
      );
      const newStation = new Station({
        ...station,
        current: true,
        effectiveDate: effectiveDate ? moment(effectiveDate, "MM/DD/YYYY") : moment(),
        system: "LIRR",
        destinations: destinationAndFareObject
      });
      return newStation.save();
    });

    const newStations = await Promise.all(newStationPromises);
    return newStations;
  } catch (error) {
    return `Error from LIRR.importFile(): ${error}`;
  }
};

const createFareObjects = (fareGroups, destinations) => {
  const result = [];
  let currentOrigin;

  fareGroups.forEach(row => {
    // create fareObject
    if (row[0].length) {
      currentOrigin = row[0];
      result.push({
        origin: row[0]
      });
    }
    // add fares to object
    const fareType = normalizeFareType(row[1]);
    const originIndex = result.findIndex(obj => obj.origin === currentOrigin);
    row.forEach((fare, i) => {
      const destination = destinations[i];
      if (i > 1 && fare !== "n/a") {
        if (result[originIndex][destination]) {
          result[originIndex][destination][fareType] = normalizeFare(fare);
        } else {
          result[originIndex][destination] = {
            [fareType]: normalizeFare(fare)
          };
        }
      }
    });
  });

  return result;
};

module.exports = {
  importFile
};

// used once to import static station data
// const importStationData = async ({ file }) => {
//   const data = await readCSV(file);
//   const stations = data.slice(1);
//   const stationObjects = [];

//   stations.forEach(station => {
//     stationObjects.push({
//       fareZone: station[3],
//       name: station[0],
//       lines: station[1].split(",").map(item => item.trim())
//     });
//   });
//   return stationObjects;
// }

const stations = [
  {
    fareZone: "1",
    name: "Atlantic Terminal",
    lines: ["Atlantic Branch (City Terminal Zone)"]
  },
  {
    fareZone: "1",
    name: "East New York",
    lines: ["Atlantic Branch (City Terminal Zone)"]
  },
  {
    fareZone: "1",
    name: "Nostrand Avenue",
    lines: ["Atlantic Branch (City Terminal Zone)"]
  },
  {
    fareZone: "3",
    name: "Laurelton",
    lines: ["Atlantic Branch (Far Rockaway Branch)"]
  },
  {
    fareZone: "3",
    name: "Locust Manor",
    lines: ["Atlantic Branch (Far Rockaway Branch)"]
  },
  {
    fareZone: "3",
    name: "Rosedale",
    lines: ["Atlantic Branch (Far Rockaway Branch)"]
  },
  {
    fareZone: "4",
    name: "Valley Stream",
    lines: ["Atlantic Branch (Far Rockaway Branch)"]
  },
  {
    fareZone: "4",
    name: "Belmont Park",
    lines: ["Belmont Park Branch"]
  },
  {
    fareZone: "4",
    name: "Cedarhurst",
    lines: ["Far Rockaway Branch"]
  },
  {
    fareZone: "4",
    name: "Gibson",
    lines: ["Far Rockaway Branch"]
  },
  {
    fareZone: "4",
    name: "Hewlett",
    lines: ["Far Rockaway Branch"]
  },
  {
    fareZone: "4",
    name: "Inwood",
    lines: ["Far Rockaway Branch"]
  },
  {
    fareZone: "4",
    name: "Lawrence",
    lines: ["Far Rockaway Branch"]
  },
  {
    fareZone: "4",
    name: "Woodmere",
    lines: ["Far Rockaway Branch"]
  },
  {
    fareZone: "4",
    name: "Far Rockaway",
    lines: ["Far Rockaway Branch"]
  },
  {
    fareZone: "4",
    name: "Bellerose",
    lines: ["Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "Country Life Press",
    lines: ["Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "Garden City",
    lines: ["Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "Hempstead",
    lines: ["Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "Nassau Boulevard",
    lines: ["Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "Stewart Manor",
    lines: ["Hempstead Branch"]
  },
  {
    fareZone: "7",
    name: "Centre Avenue",
    lines: ["Long Beach Branch"]
  },
  {
    fareZone: "7",
    name: "East Rockaway",
    lines: ["Long Beach Branch"]
  },
  {
    fareZone: "7",
    name: "Island Park",
    lines: ["Long Beach Branch"]
  },
  {
    fareZone: "7",
    name: "Long Beach",
    lines: ["Long Beach Branch"]
  },
  {
    fareZone: "7",
    name: "Oceanside",
    lines: ["Long Beach Branch"]
  },
  {
    fareZone: "1",
    name: "Forest Hills",
    lines: ["Main Line (City Terminal Zone)"]
  },
  {
    fareZone: "1",
    name: "Hunterspoint Avenue",
    lines: ["Main Line (City Terminal Zone)"]
  },
  {
    fareZone: "1",
    name: "Kew Gardens",
    lines: ["Main Line (City Terminal Zone)"]
  },
  {
    fareZone: "3",
    name: "Hollis",
    lines: ["Main Line (Hempstead Branch)"]
  },
  {
    fareZone: "3",
    name: "Queens Village",
    lines: ["Main Line (Hempstead Branch)"]
  },
  {
    fareZone: "4",
    name: "Merillon Avenue",
    lines: ["Main Line (Port Jefferson Branch)"]
  },
  {
    fareZone: "4",
    name: "Mineola",
    lines: ["Main Line (Port Jefferson Branch)"]
  },
  {
    fareZone: "4",
    name: "New Hyde Park",
    lines: ["Main Line (Port Jefferson Branch)"]
  },
  {
    fareZone: "7",
    name: "Carle Place",
    lines: ["Main Line (Port Jefferson Branch)"]
  },
  {
    fareZone: "7",
    name: "Hicksville",
    lines: ["Main Line (Port Jefferson Branch)"]
  },
  {
    fareZone: "7",
    name: "Westbury",
    lines: ["Main Line (Port Jefferson Branch)"]
  },
  {
    fareZone: "7",
    name: "Bethpage",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "7",
    name: "Farmingdale",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "9",
    name: "Deer Park",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "9",
    name: "Pinelawn",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "9",
    name: "Wyandanch",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "10",
    name: "Brentwood",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "10",
    name: "Central Islip",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "10",
    name: "Medford",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "10",
    name: "Ronkonkoma",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "12",
    name: "Yaphank",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "14",
    name: "Greenport",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "14",
    name: "Mattituck",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "14",
    name: "Riverhead",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "14",
    name: "Southold",
    lines: ["Main Line (Ronkonkoma Branch)"]
  },
  {
    fareZone: "4",
    name: "Floral Park",
    lines: ["Main Line", "Hempstead Branch"]
  },
  {
    fareZone: "1",
    name: "Long Island City",
    lines: ["Main Line", "Montauk Branch (City Terminal Zone)"]
  },
  {
    fareZone: "1",
    name: "Woodside",
    lines: ["Main Line", "Port Washington Branch (City Terminal Zone)"]
  },
  {
    fareZone: "3",
    name: "Jamaica",
    lines: [
      "Main Line",
      "Atlantic Branch",
      "Montauk Branch (City Terminal Zone)"
    ]
  },
  {
    fareZone: "10",
    name: "Bay Shore",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "10",
    name: "Great River",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "10",
    name: "Islip",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "10",
    name: "Oakdale",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "10",
    name: "Patchogue",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "10",
    name: "Sayville",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "12",
    name: "Bellport",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "12",
    name: "Mastic–Shirley",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "12",
    name: "Speonk",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "14",
    name: "Amagansett",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "14",
    name: "Bridgehampton",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "14",
    name: "East Hampton",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "14",
    name: "Hampton Bays",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "14",
    name: "Montauk",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "14",
    name: "Southampton",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "14",
    name: "Westhampton",
    lines: ["Montauk Branch"]
  },
  {
    fareZone: "7",
    name: "Baldwin",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "7",
    name: "Bellmore",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "7",
    name: "Freeport",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "7",
    name: "Massapequa",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "7",
    name: "Massapequa Park",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "7",
    name: "Merrick",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "7",
    name: "Rockville Centre",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "7",
    name: "Seaford",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "7",
    name: "Wantagh",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "9",
    name: "Amityville",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "9",
    name: "Babylon",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "9",
    name: "Copiague",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "9",
    name: "Lindenhurst",
    lines: ["Montauk Branch (Babylon Branch)"]
  },
  {
    fareZone: "3",
    name: "St. Albans",
    lines: ["Montauk Branch (West Hempstead Branch)"]
  },
  {
    fareZone: "4",
    name: "Lynbrook",
    lines: ["Montauk Branch", "Long Beach Branch"]
  },
  {
    fareZone: "1",
    name: "Penn Station",
    lines: ["Northeast Corridor (City Terminal Zone)"]
  },
  {
    fareZone: "4",
    name: "East Williston",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Albertson",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Glen Cove",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Glen Head",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Glen Street",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Greenvale",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Locust Valley",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Oyster Bay",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Roslyn",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Sea Cliff",
    lines: ["Oyster Bay Branch"]
  },
  {
    fareZone: "7",
    name: "Syosset",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "9",
    name: "Cold Spring Harbor",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "9",
    name: "Huntington",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "9",
    name: "Northport",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "10",
    name: "Greenlawn",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "10",
    name: "Kings Park",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "10",
    name: "Port Jefferson",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "10",
    name: "Smithtown",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "10",
    name: "St. James",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "10",
    name: "Stony Brook",
    lines: ["Port Jefferson Branch"]
  },
  {
    fareZone: "1",
    name: "Mets–Willets Point",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "3",
    name: "Auburndale",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "3",
    name: "Bayside",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "3",
    name: "Broadway",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "3",
    name: "Douglaston",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "3",
    name: "Flushing–Main Street",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "3",
    name: "Little Neck",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "3",
    name: "Murray Hill",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "4",
    name: "Great Neck",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "4",
    name: "Manhasset",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "4",
    name: "Plandome",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "4",
    name: "Port Washington",
    lines: ["Port Washington Branch"]
  },
  {
    fareZone: "4",
    name: "Hempstead Gardens",
    lines: ["West Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "Lakeview",
    lines: ["West Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "Malverne",
    lines: ["West Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "West Hempstead",
    lines: ["West Hempstead Branch"]
  },
  {
    fareZone: "4",
    name: "Westwood",
    lines: ["West Hempstead Branch"]
  }
];
