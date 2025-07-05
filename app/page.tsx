"use client";

import { ConnectButton, useActiveWallet, useActiveAccount } from "thirdweb/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Calendar, Shield, Wallet, Trophy, ArrowRight, Check, Sparkles, Users, Lock } from "lucide-react";
import { client } from "@/config/client";
import { useWalletUser } from "@/components/providers/WalletUserProvider";
import { baseSepolia } from "thirdweb/chains";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { MagicCard } from "@/components/magicui/magic-card";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function HomePage() {
  const wallet = useActiveWallet(); // undefined if not connected
  const isConnected = !!wallet;
  console.log(isConnected);
  const { account, user } = useWalletUser() as any;

  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description: "Every registration and attendance is recorded on the blockchain for maximum transparency and trust."
    },
    {
      icon: Trophy,
      title: "NFT Rewards",
      description: "Attendees receive unique proof-of-attendance NFTs that serve as digital collectibles and certificates."
    },
    {
      icon: Lock,
      title: "Secure & Decentralized",
      description: "No single point of failure. Your events and data are secured by the power of blockchain technology."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built for the Web3 community, connecting event organizers with engaged blockchain enthusiasts."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated Dot Pattern Background */}
        <DotPattern className="opacity-40 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]" glow />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMwMzY5YiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMiIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPgo8L3N2Zz4=')] opacity-10"></div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                Decentralized Event Platform
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Host Events on the
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">Blockchain</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Create memorable events, manage registrations, and reward attendees with unique NFTs. The future of event management is
                here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!account?.address ? (
                <ConnectButton
                  theme="dark"
                  client={client}
                  chain={baseSepolia}
                  appMetadata={{
                    name: "EventChain",
                    url: "https://eventchain.example.com"
                  }}
                />
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link href="/events/create">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Create Event
                    </Button>
                  </Link>
                  <Link href="/events">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                    >
                      Explore Events
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose EventChain?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of event management with blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <MagicCard key={index} className="group relative border-0 bg-gray-800/80 backdrop-blur-sm shadow-md overflow-hidden">
                <Card className="bg-transparent border-0 shadow-none">
                  <BorderBeam size={120} duration={7} className="from-purple-400 via-blue-400 to-indigo-400" />
                  <CardContent className="p-8 text-center">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl text-white">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </MagicCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white">1,200+</div>
              <div className="text-purple-100">Events Created</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white">50,000+</div>
              <div className="text-purple-100">NFTs Minted</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-white">25,000+</div>
              <div className="text-purple-100">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Transform Your Events?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of event organizers who are already using blockchain technology to create more engaging and trustworthy events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events/create">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Start Creating Events
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                >
                  Explore Events
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
