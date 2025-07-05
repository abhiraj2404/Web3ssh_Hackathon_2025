"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, Calendar, MapPin, Trophy, CheckCircle, Clock, ExternalLink } from "lucide-react";
import axios from "axios";

export default function EventManagementPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventAndRegistrations() {
      setLoading(true);
      setError(null);
      try {
        const eventRes = await axios.get(`/api/events?id=${params.id}`);
        setEvent(eventRes.data);
        const regRes = await axios.get(`/api/registrations?eventId=${params.id}`);
        setAttendees(regRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Failed to fetch event or registrations");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchEventAndRegistrations();
  }, [params.id]);

  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The event you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const registeredCount = attendees.length;
  // All attendees from registrations table have status 'registered'
  const confirmedCount = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Event Management</h1>
            <h2 className="text-xl text-purple-100 mb-4">{event.title}</h2>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {eventDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>NFT: {event.nft_name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Registered</CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{registeredCount}</div>
              <p className="text-xs text-gray-500">People registered for this event</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmed Attendees</CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{confirmedCount}</div>
              <p className="text-xs text-gray-500">Attendance confirmed & NFTs minted</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">NFTs Minted</CardTitle>
              <div className="p-2 rounded-lg bg-purple-50">
                <Trophy className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{confirmedCount}</div>
              <p className="text-xs text-gray-500">Proof-of-attendance NFTs distributed</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendee Management Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Attendee Management
            </CardTitle>
            <p className="text-sm text-gray-600">Manage registrations and mint NFTs for confirmed attendees</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Socials</TableHead>
                    <TableHead>Date Registered</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell>
                        <div className="font-mono text-xs">{attendee.user_id}</div>
                      </TableCell>
                      <TableCell>{attendee.email || "-"}</TableCell>
                      <TableCell>
                        {attendee.socials ? (
                          <a href={attendee.socials} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                            {attendee.socials}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(attendee.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Clock className="h-3 w-3 mr-1" />
                          Registered
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {attendees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No registrations yet</h3>
                <p className="text-gray-600">Attendees will appear here once they register for your event</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
