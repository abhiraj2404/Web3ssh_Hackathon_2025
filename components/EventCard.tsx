'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl?: string;
    nftName: string;
    registrations: number;
    maxAttendees?: number;
  };
  showActions?: boolean;
  variant?: 'default' | 'dashboard';
}

export default function EventCard({ event, showActions = true, variant = 'default' }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="p-0">
        <div 
          className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 relative overflow-hidden"
          style={{
            backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!event.imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-white/80" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge variant={isUpcoming ? 'default' : 'secondary'}>
              {isUpcoming ? 'Upcoming' : 'Past'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-purple-600 transition-colors">
              {event.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 mt-2">
              {event.description}
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{eventDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{event.registrations} registered</span>
              {event.maxAttendees && (
                <span className="text-xs ml-1">/ {event.maxAttendees} max</span>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-purple-700">
              🎁 NFT Reward: {event.nftName}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              Get a unique proof-of-attendance NFT for attending this event
            </p>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-6 pt-0">
          <div className="flex space-x-3 w-full">
            {variant === 'dashboard' ? (
              <>
                <Link href={`/dashboard/event/${event.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Manage
                  </Button>
                </Link>
                <Link href={`/events/${event.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={`/events/${event.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    View Details
                  </Button>
                </Link>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}