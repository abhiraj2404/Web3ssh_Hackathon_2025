"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Users, Trophy, TrendingUp, Eye, Edit, BarChart3, CheckCircle, Clock } from "lucide-react";
import EventCard from "@/components/EventCard";
import { mockNFTs } from "@/lib/mockData";
import { useWalletUser } from "@/components/providers/WalletUserProvider";
import axios from "axios";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("events");
  const { account, user } = useWalletUser() as any;
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = [
    {
      title: "Total Events",
      value: "12",
      change: "+3 this month",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Registrations",
      value: "2,847",
      change: "+12% from last month",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "NFTs Minted",
      value: "1,234",
      change: "+567 this month",
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+25% from last month",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  useEffect(() => {
    async function fetchUserEvents() {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/events?userId=${user.id}`);
        setUserEvents(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Failed to fetch your events");
      } finally {
        setLoading(false);
      }
    }
    fetchUserEvents();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-800 to-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Dashboard</h1>
              <p className="text-purple-100">Manage your events and track performance</p>
            </div>

            <Link href="/events/create">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-gray-900/80 border border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor} bg-opacity-20`}>
                  <stat.icon className={`h-4 w-4 ${stat.color.replace("text-", "text-")} text-opacity-80`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <p className="text-xs text-gray-400">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="nfts">NFT Gallery</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Events</h2>
                <p className="text-gray-100">Events you've created and are managing</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            {loading ? (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your events...</h3>
              </Card>
            ) : error ? (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">{error}</h3>
              </Card>
            ) : userEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600 mb-6">Start creating your first event to build your community</p>
                <Link href="/events/create">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.map((event) => (
                  <EventCard key={event.id} event={event} variant="dashboard" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-whit mb-2">Your NFT Collection</h2>
              <p className="text-gray-100">Proof-of-attendance NFTs from events you've attended</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockNFTs.map((nft) => (
                <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-600 relative">
                    <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/50 text-white">NFT</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{nft.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{nft.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Minted: {new Date(nft.attendedAt).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Analytics Overview</h2>
              <p className="text-gray-100">Track your event performance and engagement</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Registration Trends</h3>
                <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-gray-100">Chart will be displayed here</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Event Performance</h3>
                <div className="space-y-4 text-black">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Active Events</span>
                    </div>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="font-semibold">12</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
