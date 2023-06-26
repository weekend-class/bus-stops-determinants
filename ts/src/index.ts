/**
 * @author rubichandrap
 * @description This is a demonstration of problem-solving
 * using the Dijkstra algorithm, which is intended for
 * weekend classes at the author's office
 */

type BusStop = {
  key: string;
  label: string;
};

type AdjacentBusStop = {
  key: string;
  shouldTransit: boolean;
};

type BusStopWithAdjacentBusStops = {
  key: string;
  label: string;
  adjacentBusStops: AdjacentBusStop[];
};

interface ITjBusStopsGraphGraph {
  busStops: Record<string, BusStopWithAdjacentBusStops>;
  addBusStop: (busStop: BusStop) => void;
  addBusTrack: (
    source: string,
    destination: string,
    shouldTransit?: boolean
  ) => void;
  getAdjacentBusStop: (target: string) => void;
}

class TjBusStopsGraph implements ITjBusStopsGraphGraph {
  public busStops: Record<string, BusStopWithAdjacentBusStops>;

  constructor(busStops: Record<string, BusStopWithAdjacentBusStops> = {}) {
    this.busStops = busStops;
  }

  public getbusStops() {
    return this.busStops;
  }

  public addBusStop(busStop: BusStop) {
    // throw error if the key is not provided
    if (!busStop.key) {
      throw new Error("Bus Stop key is required");
    }

    // throw error if the label is not provided
    if (!busStop.label) {
      throw new Error("Bus Stop label is required");
    }

    // throw error if the busStop key is already exists
    if (this.busStops[busStop.key] !== undefined) {
      throw new Error(
        `busStop with the key of ${busStop.key} already exists in the graph`
      );
    }

    // add the busStop to the busStops collection
    this.busStops[busStop.key] = {
      key: busStop.key,
      label: busStop.label,
      adjacentBusStops: [],
    };
  }

  public addBusTrack(
    source: string,
    destination: string,
    shouldTransit: boolean = false
  ) {
    // throw error if the source key does not exist in the busStops collection
    if (!this.busStops[source]) {
      throw new Error(
        `Bus Stop with the key ${source} does not exist in the collection`
      );
    }

    // throw error if the destination key does not exist in the busStops collection
    if (!this.busStops[destination]) {
      throw new Error(
        `Bus Stop with the key ${destination} does not exist in the collection`
      );
    }

    const sourceBusStop = this.busStops[source];

    // throw error if the destination key already included as adjacent of source
    if (
      sourceBusStop.adjacentBusStops.some(
        (adjacent) => adjacent.key === destination
      )
    ) {
      throw new Error(
        `Bus Stop with key ${destination} as destination, is already included as adjacent of busStop ${source} as source`
      );
    }

    const destinationBusStop = this.busStops[destination];

    // throw error if the source key already included as adjacent of destination
    if (
      destinationBusStop.adjacentBusStops.some(
        (adjacent) => adjacent.key === source
      )
    ) {
      throw new Error(
        `Bus Stop with key ${source} as source, is already included as adjacent of busStop ${destination} as destination`
      );
    }

    // push the destination to the source
    this.busStops[source].adjacentBusStops.push({
      key: destination,
      shouldTransit,
    });
    // push the source to the destination
    this.busStops[destination].adjacentBusStops.push({
      key: source,
      shouldTransit,
    });
  }

  public getAdjacentBusStop(target: string) {
    // throw error if the target key doest not exist in the collection
    if (!this.busStops[target]) {
      throw new Error(
        `Bus Stop with the key ${target} does not exists in the collection`
      );
    }

    return this.busStops[target];
  }

  public findShortestPath(
    source: string,
    destination: string,
    asInstructions: boolean = false
  ) {
    // throw error if the source key does not exist in the busStops collection
    if (!this.busStops[source]) {
      throw new Error(
        `Bus Stop with the key ${source} does not exist in the collection`
      );
    }

    // throw error if the destination key does not exist in the busStops collection
    if (!this.busStops[destination]) {
      throw new Error(
        `Bus Stop with the key ${destination} does not exist in the collection`
      );
    }

    // initialize distances, visited busStops, and previous busStop
    const distances: Record<string, number> = {};
    const visited: Record<string, boolean> = {};
    const previous: Record<string, AdjacentBusStop | null> = {};

    for (const key in this.busStops) {
      distances[key] = Infinity;
      visited[key] = false;
      previous[key] = null;
    }

    // initialize the distance to the source busStop to 0
    distances[source] = 0;

    while (true) {
      let closestBusStop = null;
      let shortestDistance = Infinity;

      // Find the unvisited busStop with the shortest distance
      for (const key in this.busStops) {
        if (!visited[key] && distances[key] < shortestDistance) {
          closestBusStop = key;
          shortestDistance = distances[key];
        }
      }

      // if no unvisited busStop is found or the destination is reached, break the loop
      if (!closestBusStop || closestBusStop === destination) {
        break;
      }

      // mark the closestBusStop as visited
      visited[closestBusStop] = true;

      // update distances to the adjacent busStops
      const currentBusStop = this.busStops[closestBusStop];
      for (const adjacentBusStop of currentBusStop.adjacentBusStops) {
        const { key, shouldTransit } = adjacentBusStop;

        const distance = distances[closestBusStop];

        // check if the distance of the distance of the adjacentBusStop
        // is less than the distance to the closestBusStop
        // as default, distances are Infinity
        if (distance < distances[key]) {
          distances[key] = distance;
          previous[key] = {
            key: closestBusStop,
            shouldTransit,
          };
        }
      }
    }

    // build the shortest path
    // shouldTransit in each path indicates
    // that the current busStop needs to transit
    // to get to the next busStop in the iteration
    const path: AdjacentBusStop[] = [
      {
        key: destination,
        shouldTransit: false,
      },
    ];
    let currentBusStop: string | null = destination;

    while (currentBusStop !== null) {
      if (previous[currentBusStop] === null) {
        break;
      }

      const { key, shouldTransit } = previous[
        currentBusStop
      ] as AdjacentBusStop;
      path.unshift({ key, shouldTransit });
      currentBusStop = key;
    }

    if (asInstructions) {
      return this._asInstructions(path);
    }

    return path;
  }

  private _asInstructions(path: AdjacentBusStop[]) {
    if (path.length === 1) {
      const busStopLabel = this.busStops[path[0].key].label;
      return `Anda sudah mencapai titik tujuan anda, halte ${busStopLabel}`;
    }

    let instructions = `Dari halte `;
    let shouldTransit = false;

    for (let i = 0; i < path.length; i++) {
      const busStopLabel = this.busStops[path[i].key].label;

      // the first busStop
      if (i === 0) {
        instructions += busStopLabel + ", ";
      }
      // shouldTransit to get to the last busStop
      else if (shouldTransit && i === path.length - 1) {
        instructions += `dan transit sekaligus tiba ditujuan akhir halte ${busStopLabel}`;
      }
      // the last busStop
      else if (i === path.length - 1) {
        instructions += `dan tiba ditujuan akhir halte ${busStopLabel}`;
      }
      // shouldTransit
      else if (shouldTransit) {
        instructions += `transit ke halte ${busStopLabel}, `;
      }
      // should continue
      else {
        // find the last busStop before transit
        let lastBusStopBeforeTransit: AdjacentBusStop | null = null;
        let lastIndex = i + 1;
        for (let j = lastIndex; j < path.length; j++) {
          if (path[j].shouldTransit) {
            lastBusStopBeforeTransit = path[j];
            lastIndex = j;
            break;
          }
        }

        if (lastBusStopBeforeTransit !== null) {
          const busStopLabel =
            this.busStops[lastBusStopBeforeTransit.key].label;
          instructions += `menuju halte ${busStopLabel}, `;
          i = lastIndex;
        }
      }

      if (path[i].shouldTransit) {
        shouldTransit = true;
      } else {
        shouldTransit = false;
      }
    }

    return instructions;
  }
}

const tjBusStopsGraph = new TjBusStopsGraph();

// adding busStops
tjBusStopsGraph.addBusStop({ key: "1-1", label: "Blok M" });
tjBusStopsGraph.addBusStop({ key: "1-2", label: "CSW-ASEAN" });
tjBusStopsGraph.addBusStop({ key: "1-3", label: "Masjid Agung" });
tjBusStopsGraph.addBusStop({ key: "1-4", label: "Bundaran Senayan" });
tjBusStopsGraph.addBusStop({ key: "1-5", label: "GBK" });
tjBusStopsGraph.addBusStop({ key: "1-6", label: "Polda" });
tjBusStopsGraph.addBusStop({
  key: "1-7",
  label: "Bendungan Hilir Semanggi",
});
tjBusStopsGraph.addBusStop({
  key: "1-8",
  label: "Karet Sudirman",
});
tjBusStopsGraph.addBusStop({
  key: "1-9",
  label: "Dukuh Atas",
});
tjBusStopsGraph.addBusStop({
  key: "1-10",
  label: "Tosari",
});

// adding busTrack
tjBusStopsGraph.addBusTrack("1-1", "1-2", true);
tjBusStopsGraph.addBusTrack("1-1", "1-3");
tjBusStopsGraph.addBusTrack("1-2", "1-3", true);
tjBusStopsGraph.addBusTrack("1-3", "1-4");
tjBusStopsGraph.addBusTrack("1-4", "1-5");
tjBusStopsGraph.addBusTrack("1-5", "1-6");
tjBusStopsGraph.addBusTrack("1-6", "1-7");
tjBusStopsGraph.addBusTrack("1-7", "1-8", true);
tjBusStopsGraph.addBusTrack("1-8", "1-9");
tjBusStopsGraph.addBusTrack("1-9", "1-10");

// find the shortest path
// from 1-1 to 1-10
// console.log(tjBusStopsGraph.findShortestPath("1-1", "1-10", true));
// from 1-10 to 1-1
// console.log(tjBusStopsGraph.findShortestPath("1-10", "1-1", true));
// from 1-7 to 1-8
// console.log(tjBusStopsGraph.findShortestPath("1-7", "1-8", true));
// from 1-2 to 1-7
console.log(tjBusStopsGraph.findShortestPath("1-2", "1-7", true));
