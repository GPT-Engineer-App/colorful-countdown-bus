import React, { useEffect, useState } from "react";
import { parseGTFS } from "../utils/gtfsParser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GTFS_URL = "https://developers.google.com/static/transit/gtfs/examples/sample-feed.zip";

const Index = () => {
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await parseGTFS(GTFS_URL);
        setDepartures(data);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing GTFS data:", error);
        setError("Failed to load departure data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCountdown = (departureTime) => {
    const departureDate = new Date(departureTime);
    const now = new Date();
    const diff = departureDate - now;

    if (diff <= 0) {
      return "Departed";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <h1 className="text-4xl text-white mb-8">Bus Departures</h1>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departures.map((departure, index) => (
            <Card key={index} className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
              <CardHeader>
                <CardTitle>{departure.trip_id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Departure Time: {departure.departure_time}</p>
                <Badge variant="outline" className="mt-2">
                  {renderCountdown(departure.departure_time)}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;