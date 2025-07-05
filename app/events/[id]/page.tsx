"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, User, Clock, Users, Trophy, ArrowLeft, Check, Heart, Share2, ExternalLink } from "lucide-react";
import axios from "axios";
import { useWalletUser } from "@/components/providers/WalletUserProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { account, user } = useWalletUser() as any;
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [host, setHost] = useState<any>(null);
  const [hostLoading, setHostLoading] = useState(true);
  const [hostError, setHostError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regLoading, setRegLoading] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerSocials, setRegisterSocials] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/events?id=${params.id}`);
        setEvent(res.data);
        console.log(res.data.image_url);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchEvent();
  }, [params.id]);

  useEffect(() => {
    async function fetchHost() {
      if (!event?.creator_id) return;
      setHostLoading(true);
      setHostError(null);
      try {
        const res = await axios.get(`/api/users?id=${event.creator_id}`);
        setHost(res.data);
      } catch (err: any) {
        setHostError(err.response?.data?.error || err.message || "Failed to fetch host");
      } finally {
        setHostLoading(false);
      }
    }
    if (event?.creator_id) fetchHost();
  }, [event?.creator_id]);

  useEffect(() => {
    async function fetchRegistrations() {
      if (!params.id) return;
      setRegLoading(true);
      setRegError(null);
      try {
        const res = await axios.get(`/api/registrations?eventId=${params.id}`);
        setRegistrations(res.data);
        // Check if current user is registered
        if (user?.id && res.data.some((r: any) => r.user_id === user.id)) {
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }
      } catch (err: any) {
        setRegError(err.response?.data?.error || err.message || "Failed to fetch registrations");
      } finally {
        setRegLoading(false);
      }
    }
    if (params.id && user?.id) fetchRegistrations();
  }, [params.id, user?.id]);

  const handleRegister = async () => {
    if (!user?.id || !params.id) return;
    setRegistering(true);
    setRegisterError(null);
    try {
      await axios.post("/api/registrations", {
        user_id: user.id,
        event_id: params.id,
        email: registerEmail,
        socials: registerSocials,
        metadata: null
      });
      setIsRegistered(true);
      setShowRegisterDialog(false);
      // Refetch registrations to update count
      const res = await axios.get(`/api/registrations?eventId=${params.id}`);
      setRegistrations(res.data);
    } catch (err: any) {
      setRegisterError(err.response?.data?.error || err.message || "Failed to register");
    } finally {
      setRegistering(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    navigator.share?.({
      title: event.title,
      text: event.description,
      url: window.location.href
    }) || navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="text-white text-lg">Loading event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-300 mb-4">{error || "The event you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/events")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const spotsRemaining = event.max_attendee ? event.max_attendee - registrations.length : null;
  const progressPercentage = event.max_attendee ? (registrations.length / event.max_attendee) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="relative">
        <div
          className="h-80 bg-cover bg-center relative"
          style={{
            backgroundImage: event.image_url ? `url(${event.image_url})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute top-6 left-6">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="bg-black/20 border-white/20 text-white hover:bg-black/40 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white">
                    <div className="text-sm text-gray-300">Date & Time</div>
                    <div className="font-semibold">
                      {eventDate.toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </div>
                    <div className="text-sm">
                      {eventDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white">
                    <div className="text-sm text-gray-300">Location</div>
                    <div className="font-semibold">{event.location}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <User className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white">
                    <div className="text-sm text-gray-300">Hosted by</div>
                    <div className="font-semibold">EventChain</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About this event */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl">About this event</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            {/* What you'll get */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl">What you'll get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Access to the event and all its activities</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Blockchain verification of your attendance</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Exclusive collectible NFT as proof of attendance</span>
                </div>
              </CardContent>
            </Card>

            {/* About the host */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl">About the host</CardTitle>
              </CardHeader>
              <CardContent>
                {hostLoading ? (
                  <div className="text-gray-300">Loading host...</div>
                ) : hostError ? (
                  <div className="text-red-400">{hostError}</div>
                ) : host ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{host.name || "Unknown Host"}</div>
                      <div className="text-gray-400 text-sm">{host.walletAddress}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-300">Host not found</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Status */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                {spotsRemaining !== null && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">Spots remaining</span>
                      <span className="text-white font-semibold">
                        {spotsRemaining} of {event.max_attendee}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-300 mb-6">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{regLoading ? "Loading..." : registrations.length} people registered</span>
                </div>

                {isRegistered ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" disabled>
                    <Check className="h-4 w-4 mr-2" />
                    Registered
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowRegisterDialog(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    disabled={!isUpcoming || registering}
                  >
                    {registering ? "Registering..." : isUpcoming ? "Register Now" : "Event Ended"}
                  </Button>
                )}

                {isRegistered && (
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    By registering, you'll be able to claim your NFT at the event using the same wallet.
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSave} variant="outline" size="sm" className="flex-1 border-white/20 text-white hover:bg-white/10">
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current text-red-500" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button onClick={handleShare} variant="outline" size="sm" className="flex-1 border-white/20 text-white hover:bg-white/10">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* NFT Reward */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">NFT Reward</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{event.nft_name}</div>
                    <div className="text-gray-400 text-sm">Symbol: {event.nft_symbol}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Link to your social profile (e.g. Twitter, LinkedIn)"
              value={registerSocials}
              onChange={(e) => setRegisterSocials(e.target.value)}
              required
            />
            {registerError && <div className="text-red-600 text-sm">{registerError}</div>}
          </div>
          <DialogFooter>
            <Button onClick={handleRegister} disabled={registering || !registerEmail || !registerSocials}>
              {registering ? "Registering..." : "Register"}
            </Button>
            <Button variant="outline" onClick={() => setShowRegisterDialog(false)} disabled={registering}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
