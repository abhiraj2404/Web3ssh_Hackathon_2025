"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, Calendar, MapPin, Trophy, CheckCircle, Clock } from "lucide-react";
import axios from "axios";
import { prepareContractCall, getContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/config/client";
import { EVENTMANAGER_CONTRACT_ADDRESS, eventManagerABI } from "@/config/abi";
import { baseSepolia } from "thirdweb/chains";

export default function EventManagementPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState<string | null>(null);

  // Setup contract and transaction hook
  const contract = getContract({
    client,
    chain: baseSepolia,
    address: EVENTMANAGER_CONTRACT_ADDRESS
  });
  const { mutate: sendTransaction } = useSendTransaction();

  useEffect(() => {
    async function fetchEventAndData() {
      setLoading(true);
      setError(null);
      try {
        const eventRes = await axios.get(`/api/events?id=${params.id}`);
        setEvent(eventRes.data);
        const regRes = await axios.get(`/api/registrations?eventId=${params.id}`);
        setRegistrations(regRes.data);
        const attRes = await axios.get(`/api/attendances?eventId=${params.id}`);
        setAttendances(attRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Failed to fetch event or registrations");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchEventAndData();
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

  const handleConfirmAndMint = async (user_id: string) => {
    setMinting(user_id);
    try {
      // Fetch the user's wallet address from the API
      const userRes = await axios.get(`/api/users?id=${user_id}`);
      console.log("user response", userRes);
      const userWallet = userRes.data?.walletAddress;
      if (!userWallet) throw new Error("User wallet address not found");

      console.log(event);
      console.log("sending mint transaction");
      // Prepare contract transaction for mintToAttendee
      const transaction = prepareContractCall({
        contract,
        method: "function mintToAttendee(string uuid, address attendee, uint256 amount)",
        params: [event.id, userWallet, BigInt(1)],
        value: BigInt(0)
      });
      let txHash = null;
      await new Promise((resolve, reject) => {
        sendTransaction(transaction as any, {
          onSuccess: (result) => {
            txHash = result?.transactionHash || null;
            console.log("mint txn hash", txHash);
            resolve(result);
          },
          onError: (error) => {
            console.log("error in mint txn hash", error);
            reject(error);
          }
        });
      });

      await axios.post("/api/attendances", {
        user_id,
        event_id: params.id,
        nft_mint_address: userWallet,
        nft_transaction_signature: txHash
      });
      // Refetch attendances
      const attRes = await axios.get(`/api/attendances?eventId=${params.id}`);
      setAttendances(attRes.data);
    } catch (err: any) {
      console.log("error: in confirm and mint", error);
      alert(err.response?.data?.error || err.message || "Failed to confirm and mint NFT");
    } finally {
      setMinting(null);
    }
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
  const registeredCount = registrations.length;
  const confirmedCount = attendances.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-800 to-blue-900 text-white py-12">
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Event Management</h1>
            <h2 className="text-xl text-purple-100 mb-4">{event.title}</h2>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white" />
                <span className="text-white">
                  {eventDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-white">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-white" />
                <span className="text-white">NFT: {event.nft_name}</span>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => {
                    const attendance = attendances.find((a) => a.user_id === reg.user_id);
                    return (
                      <TableRow key={reg.id}>
                        <TableCell>
                          <div className="font-mono text-xs">{reg.user_id}</div>
                        </TableCell>
                        <TableCell>{reg.email || "-"}</TableCell>
                        <TableCell>
                          {reg.socials ? (
                            <a href={reg.socials} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                              {reg.socials}
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{formatDate(reg.created_at)}</TableCell>
                        <TableCell>
                          {attendance ? (
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confirmed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Registered
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {attendance ? (
                            <div className="space-y-1 text-xs">
                              <div>Approved: {formatDate(attendance.created_at)}</div>
                              <div className="font-semibold text-green-700">NFT Minted</div>
                              <div className="font-mono">{attendance.nft_mint_address}</div>
                              <div className="font-mono">{attendance.nft_transaction_signature}</div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              disabled={minting === reg.user_id}
                              onClick={() => handleConfirmAndMint(reg.user_id)}
                            >
                              {minting === reg.user_id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>Confirm & Mint NFT</>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {registrations.length === 0 && (
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
