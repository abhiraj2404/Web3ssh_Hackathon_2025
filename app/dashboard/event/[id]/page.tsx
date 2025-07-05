'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  MapPin, 
  Trophy,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { mockEvents } from '@/lib/mockData';

// Mock attendee data
const mockAttendees = [
  {
    id: '1',
    userName: 'Alice Johnson',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    registeredAt: '2024-01-15T10:30:00Z',
    status: 'registered',
    confirmedAt: null,
    nftMintAddress: null,
    transactionHash: null,
  },
  {
    id: '2',
    userName: 'Bob Smith',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    registeredAt: '2024-01-16T14:20:00Z',
    status: 'confirmed',
    confirmedAt: '2024-01-20T09:15:00Z',
    nftMintAddress: '0x9876543210fedcba9876543210fedcba98765432',
    transactionHash: '0xdef456789012345678901234567890123456789012345678901234567890abcd',
  },
  {
    id: '3',
    userName: 'Carol Davis',
    walletAddress: '0x5678901234abcdef5678901234abcdef56789012',
    registeredAt: '2024-01-17T16:45:00Z',
    status: 'registered',
    confirmedAt: null,
    nftMintAddress: null,
    transactionHash: null,
  },
  {
    id: '4',
    userName: 'David Wilson',
    walletAddress: '0xfedcba0987654321fedcba0987654321fedcba09',
    registeredAt: '2024-01-18T11:10:00Z',
    status: 'confirmed',
    confirmedAt: '2024-01-22T15:30:00Z',
    nftMintAddress: '0x1357924680acefdb1357924680acefdb13579246',
    transactionHash: '0x123abc789def456ghi012jkl345mno678pqr901stu234vwx567yza890bcd123ef',
  },
  {
    id: '5',
    userName: 'Eva Martinez',
    walletAddress: '0x2468135790acefdb2468135790acefdb24681357',
    registeredAt: '2024-01-19T13:25:00Z',
    status: 'registered',
    confirmedAt: null,
    nftMintAddress: null,
    transactionHash: null,
  },
];

export default function EventManagementPage() {
  const params = useParams();
  const router = useRouter();
  const [attendees, setAttendees] = useState(mockAttendees);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const event = mockEvents.find(e => e.id === params.id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleConfirmAndMint = async (attendeeId: string) => {
    setIsProcessing(attendeeId);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAttendees(prev => prev.map(attendee => 
      attendee.id === attendeeId 
        ? {
            ...attendee,
            status: 'confirmed',
            confirmedAt: new Date().toISOString(),
            nftMintAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
            transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          }
        : attendee
    ));
    
    setIsProcessing(null);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const eventDate = new Date(event.date);
  const registeredCount = attendees.length;
  const confirmedCount = attendees.filter(a => a.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Event Management
            </h1>
            <h2 className="text-xl text-purple-100 mb-4">
              {event.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{eventDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>NFT: {event.nftName}</span>
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
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Registered
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {registeredCount}
              </div>
              <p className="text-xs text-gray-500">
                People registered for this event
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Confirmed Attendees
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {confirmedCount}
              </div>
              <p className="text-xs text-gray-500">
                Attendance confirmed & NFTs minted
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                NFTs Minted
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-50">
                <Trophy className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {confirmedCount}
              </div>
              <p className="text-xs text-gray-500">
                Proof-of-attendance NFTs distributed
              </p>
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
            <p className="text-sm text-gray-600">
              Manage registrations and mint NFTs for confirmed attendees
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User & Wallet</TableHead>
                    <TableHead>Date Registered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{attendee.userName}</div>
                          <div className="text-sm text-gray-500 font-mono">
                            {formatAddress(attendee.walletAddress)}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(attendee.registeredAt)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {attendee.status === 'registered' ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Registered
                          </Badge>
                        ) : (
                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirmed
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {attendee.status === 'registered' ? (
                          <Button
                            onClick={() => handleConfirmAndMint(attendee.id)}
                            disabled={isProcessing === attendee.id}
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            {isProcessing === attendee.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <Trophy className="h-3 w-3 mr-2" />
                                Confirm & Mint NFT
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">
                              Confirmed: {formatDate(attendee.confirmedAt!)}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              NFT: {formatAddress(attendee.nftMintAddress!)}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500 font-mono">
                                Tx: {formatAddress(attendee.transactionHash!)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => window.open(`https://etherscan.io/tx/${attendee.transactionHash}`, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {attendees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No registrations yet
                </h3>
                <p className="text-gray-600">
                  Attendees will appear here once they register for your event
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}