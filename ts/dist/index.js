/**
 * @author rubichandrap
 * @description This is a demonstration of problem-solving
 * using the Dijkstra algorithm, which is intended for
 * weekend classes at the author's office
 */
var TjBusStopsGraph = /** @class */ (function () {
    function TjBusStopsGraph(busStops) {
        if (busStops === void 0) { busStops = {}; }
        this.busStops = busStops;
    }
    TjBusStopsGraph.prototype.getbusStops = function () {
        return this.busStops;
    };
    TjBusStopsGraph.prototype.addBusStop = function (busStop) {
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
            throw new Error("busStop with the key of ".concat(busStop.key, " already exists in the graph"));
        }
        // add the busStop to the busStops collection
        this.busStops[busStop.key] = {
            key: busStop.key,
            label: busStop.label,
            adjacentBusStops: [],
        };
    };
    TjBusStopsGraph.prototype.addBusTrack = function (source, destination, shouldTransit) {
        if (shouldTransit === void 0) { shouldTransit = false; }
        // throw error if the source key does not exist in the busStops collection
        if (!this.busStops[source]) {
            throw new Error("Bus Stop with the key ".concat(source, " does not exist in the collection"));
        }
        // throw error if the destination key does not exist in the busStops collection
        if (!this.busStops[destination]) {
            throw new Error("Bus Stop with the key ".concat(destination, " does not exist in the collection"));
        }
        var sourceBusStop = this.busStops[source];
        // throw error if the destination key already included as adjacent of source
        if (sourceBusStop.adjacentBusStops.some(function (adjacent) { return adjacent.key === destination; })) {
            throw new Error("Bus Stop with key ".concat(destination, " as destination, is already included as adjacent of busStop ").concat(source, " as source"));
        }
        var destinationBusStop = this.busStops[destination];
        // throw error if the source key already included as adjacent of destination
        if (destinationBusStop.adjacentBusStops.some(function (adjacent) { return adjacent.key === source; })) {
            throw new Error("Bus Stop with key ".concat(source, " as source, is already included as adjacent of busStop ").concat(destination, " as destination"));
        }
        // push the destination to the source
        this.busStops[source].adjacentBusStops.push({
            key: destination,
            shouldTransit: shouldTransit,
        });
        // push the source to the destination
        this.busStops[destination].adjacentBusStops.push({
            key: source,
            shouldTransit: shouldTransit,
        });
    };
    TjBusStopsGraph.prototype.getAdjacentBusStop = function (target) {
        // throw error if the target key doest not exist in the collection
        if (!this.busStops[target]) {
            throw new Error("Bus Stop with the key ".concat(target, " does not exists in the collection"));
        }
        return this.busStops[target];
    };
    TjBusStopsGraph.prototype.findShortestPath = function (source, destination, asInstructions) {
        if (asInstructions === void 0) { asInstructions = false; }
        // throw error if the source key does not exist in the busStops collection
        if (!this.busStops[source]) {
            throw new Error("Bus Stop with the key ".concat(source, " does not exist in the collection"));
        }
        // throw error if the destination key does not exist in the busStops collection
        if (!this.busStops[destination]) {
            throw new Error("Bus Stop with the key ".concat(destination, " does not exist in the collection"));
        }
        // initialize distances, visited busStops, and previous busStop
        var distances = {};
        var visited = {};
        var previous = {};
        for (var key in this.busStops) {
            distances[key] = Infinity;
            visited[key] = false;
            previous[key] = null;
        }
        // initialize the distance to the source busStop to 0
        distances[source] = 0;
        while (true) {
            var closestBusStop = null;
            var shortestDistance = Infinity;
            // Find the unvisited busStop with the shortest distance
            for (var key in this.busStops) {
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
            var currentBusStop_1 = this.busStops[closestBusStop];
            for (var _i = 0, _a = currentBusStop_1.adjacentBusStops; _i < _a.length; _i++) {
                var adjacentBusStop = _a[_i];
                var key = adjacentBusStop.key, shouldTransit = adjacentBusStop.shouldTransit;
                var distance = distances[closestBusStop];
                // check if the distance of the distance of the adjacentBusStop
                // is less than the distance to the closestBusStop
                // as default, distances are Infinity
                if (distance < distances[key]) {
                    distances[key] = distance;
                    previous[key] = {
                        key: closestBusStop,
                        shouldTransit: shouldTransit,
                    };
                }
            }
        }
        // build the shortest path
        // shouldTransit in each path indicates
        // that the current busStop needs to transit
        // to get to the next busStop in the iteration
        var path = [
            {
                key: destination,
                shouldTransit: false,
            },
        ];
        var currentBusStop = destination;
        while (currentBusStop !== null) {
            if (previous[currentBusStop] === null) {
                break;
            }
            var _b = previous[currentBusStop], key = _b.key, shouldTransit = _b.shouldTransit;
            path.unshift({ key: key, shouldTransit: shouldTransit });
            currentBusStop = key;
        }
        if (asInstructions) {
            return this._asInstructions(path);
        }
        return path;
    };
    TjBusStopsGraph.prototype._asInstructions = function (path) {
        if (path.length === 1) {
            var busStopLabel = this.busStops[path[0].key].label;
            return "Anda sudah mencapai titik tujuan anda, halte ".concat(busStopLabel);
        }
        var instructions = "Dari halte ";
        var shouldTransit = false;
        for (var i = 0; i < path.length; i++) {
            var busStopLabel = this.busStops[path[i].key].label;
            // the first busStop
            if (i === 0) {
                instructions += busStopLabel + ", ";
            }
            // shouldTransit to get to the last busStop
            else if (shouldTransit && i === path.length - 1) {
                instructions += "dan transit sekaligus tiba ditujuan akhir halte ".concat(busStopLabel);
            }
            // the last busStop
            else if (i === path.length - 1) {
                instructions += "dan tiba ditujuan akhir halte ".concat(busStopLabel);
            }
            // shouldTransit
            else if (shouldTransit) {
                instructions += "transit ke halte ".concat(busStopLabel, ", ");
            }
            // should continue
            else {
                // find the last busStop before transit
                var lastBusStopBeforeTransit = null;
                var lastIndex = i + 1;
                for (var j = lastIndex; j < path.length; j++) {
                    if (path[j].shouldTransit) {
                        lastBusStopBeforeTransit = path[j];
                        lastIndex = j;
                        break;
                    }
                }
                if (lastBusStopBeforeTransit !== null) {
                    var busStopLabel_1 = this.busStops[lastBusStopBeforeTransit.key].label;
                    instructions += "menuju halte ".concat(busStopLabel_1, ", ");
                    i = lastIndex;
                }
            }
            if (path[i].shouldTransit) {
                shouldTransit = true;
            }
            else {
                shouldTransit = false;
            }
        }
        return instructions;
    };
    return TjBusStopsGraph;
}());
var tjBusStopsGraph = new TjBusStopsGraph();
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
//# sourceMappingURL=index.js.map