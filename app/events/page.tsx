"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, MapPin } from "lucide-react";
import EventCard from "@/components/EventCard";
import axios from "axios";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || (event.category && event.category.toLowerCase() === selectedCategory);
    const matchesLocation = selectedLocation === "all" || (event.location && event.location.includes(selectedLocation));
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web3", label: "Web3" },
    { value: "defi", label: "DeFi" },
    { value: "nft", label: "NFT" },
    { value: "gaming", label: "Gaming" },
    { value: "metaverse", label: "Metaverse" },
    { value: "dao", label: "DAO" }
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "New York", label: "New York" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "Austin", label: "Austin" },
    { value: "Miami", label: "Miami" },
    { value: "Chicago", label: "Chicago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Discover Amazing Events</h1>
            <p className="text-xl text-purple-100">Join blockchain-powered events and earn exclusive NFTs</p>

            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-white/20">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="hover:bg-purple-900/40">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-white/20">
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value} className="hover:bg-purple-900/40">
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-2 sm:px-4 md:px-8">
        <div className="container mx-auto px-2 sm:px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-white">{filteredEvents.length} Events Found</h2>
              <Badge variant="outline" className="bg-purple-900/60 text-purple-200 border-purple-700">
                <Calendar className="h-3 w-3 mr-1" />
                Live Events
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">
                Showing {filteredEvents.length} of {events.length} events
              </span>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or browse all events</p>
              <Button
                className="mt-4 bg-gradient-to-r from-purple-700 to-blue-800 text-white"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLocation("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : loading ? (
            <div className="text-center py-16 text-lg text-gray-400">Loading events...</div>
          ) : error ? (
            <div className="text-center py-16 text-lg text-red-400">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-800 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white space-y-6">
            <h2 className="text-3xl font-bold">Stay Updated with New Events</h2>
            <p className="text-purple-200">Get notified when new events are created in your area</p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
              <Button variant="secondary" className="bg-white text-purple-700 hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
