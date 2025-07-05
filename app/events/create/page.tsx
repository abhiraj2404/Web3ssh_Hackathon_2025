"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, Users, Trophy, Upload, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useWalletUser } from "@/components/providers/WalletUserProvider";

export default function CreateEventPage() {
  const router = useRouter();
  const { account, user } = useWalletUser() as any;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: "",
    category: "",
    nftName: "",
    nftSymbol: "",
    nftDescription: "",
    registrationFee: "",
    eventType: "free"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [nftImage, setNftImage] = useState<File | null>(null);
  const [nftImagePreview, setNftImagePreview] = useState<string | null>(null);
  const eventFileInputRef = useRef<HTMLInputElement>(null);
  const nftFileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Compose ISO date string
      const eventDate =
        formData.date && formData.time ? new Date(`${formData.date}T${formData.time}:00Z`).toISOString() : new Date().toISOString();

      // Upload event image to Pinata if selected
      let image_url = eventImagePreview;
      if (eventImage) {
        const data = new FormData();
        data.set("file", eventImage);
        const uploadRes = await fetch("/api/pinata-upload", {
          method: "POST",
          body: data
        });
        if (!uploadRes.ok) throw new Error("Failed to upload event image");
        const { url } = await uploadRes.json();
        image_url = url;
      }
      // Upload NFT image to Pinata if selected
      let nft_image_url = nftImagePreview;
      if (nftImage) {
        const data = new FormData();
        data.set("file", nftImage);
        const uploadRes = await fetch("/api/pinata-upload", {
          method: "POST",
          body: data
        });
        if (!uploadRes.ok) throw new Error("Failed to upload NFT image");
        const { url } = await uploadRes.json();
        nft_image_url = url;
      }
      // Prepare event data
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        date: eventDate,
        location: formData.location,
        image_url,
        nft_name: formData.nftName,
        nft_symbol: formData.nftSymbol,
        nft_image_url,
        nft_collection: formData.nftName,
        creator_id: user?.id,
        on_chain_tx_signature: null,
        max_attendee: formData.maxAttendees ? parseInt(formData.maxAttendees) : 0,
        category: formData.category
      };
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create event");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file);
      setEventImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNftImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNftImage(file);
      setNftImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEventImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEventImage(null);
    setEventImagePreview(null);
    if (eventFileInputRef.current) eventFileInputRef.current.value = "";
  };

  const handleNftImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNftImage(null);
    setNftImagePreview(null);
    if (nftFileInputRef.current) nftFileInputRef.current.value = "";
  };

  const steps = [
    { number: 1, title: "Event Details", icon: Calendar },
    { number: 2, title: "NFT Configuration", icon: Trophy },
    { number: 3, title: "Review & Create", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Create New Event</h1>
            <p className="text-purple-100">Set up your blockchain-powered event with NFT rewards</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      step >= stepItem.number ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {step > stepItem.number ? <CheckCircle className="h-5 w-5" /> : <stepItem.icon className="h-5 w-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-4 ${step > stepItem.number ? "bg-purple-600" : "bg-gray-300"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm">
              {steps.map((stepItem) => (
                <div key={stepItem.number} className={`text-center ${step >= stepItem.number ? "text-purple-600" : "text-gray-400"}`}>
                  <div className="font-medium">{stepItem.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Event Details */}
          {step === 1 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web3">Web3 Conference</SelectItem>
                        <SelectItem value="defi">DeFi Summit</SelectItem>
                        <SelectItem value="nft">NFT Exhibition</SelectItem>
                        <SelectItem value="gaming">Gaming Workshop</SelectItem>
                        <SelectItem value="metaverse">Metaverse Event</SelectItem>
                        <SelectItem value="dao">DAO Workshop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange("time", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      placeholder="100"
                      value={formData.maxAttendees}
                      onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="Enter event location"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Event Type</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card
                      className={`cursor-pointer border-2 transition-colors ${
                        formData.eventType === "free" ? "border-purple-600 bg-purple-50" : "border-gray-200"
                      }`}
                      onClick={() => handleInputChange("eventType", "free")}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">🎉</div>
                        <div className="font-semibold">Free Event</div>
                        <div className="text-sm text-gray-600">No registration fee</div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer border-2 transition-colors ${
                        formData.eventType === "paid" ? "border-purple-600 bg-purple-50" : "border-gray-200"
                      }`}
                      onClick={() => handleInputChange("eventType", "paid")}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">💰</div>
                        <div className="font-semibold">Paid Event</div>
                        <div className="text-sm text-gray-600">Charge registration fee</div>
                      </CardContent>
                    </Card>
                  </div>

                  {formData.eventType === "paid" && (
                    <div className="space-y-2">
                      <Label htmlFor="registrationFee">Registration Fee (ETH)</Label>
                      <Input
                        id="registrationFee"
                        type="number"
                        step="0.001"
                        placeholder="0.05"
                        value={formData.registrationFee}
                        onChange={(e) => handleInputChange("registrationFee", e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Event Image</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                    onClick={() => eventFileInputRef.current?.click()}
                  >
                    {eventImagePreview ? (
                      <div className="relative flex justify-center">
                        <img alt="Event Preview" className="max-h-[200px] mx-auto rounded-lg object-cover" src={eventImagePreview} />
                        <Button className="absolute top-2 right-2" variant="secondary" size="sm" onClick={handleEventImageRemove}>
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-purple-500" />
                        <div className="text-lg font-semibold">Drag and drop or browse files</div>
                        <div className="text-xs text-muted-foreground">
                          Max size: 50MB
                          <br />
                          JPG, PNG, GIF, SVG
                        </div>
                      </div>
                    )}
                    <input ref={eventFileInputRef} accept="image/*" className="hidden" type="file" onChange={handleEventImageChange} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: NFT Configuration */}
          {step === 2 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  NFT Configuration
                </CardTitle>
                <p className="text-sm text-gray-600">Configure the proof-of-attendance NFT for your event</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">NFT Rewards</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Attendees will receive a unique NFT as proof of attendance. This NFT will be automatically minted when attendance is
                    verified.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nftName">NFT Name *</Label>
                    <Input
                      id="nftName"
                      placeholder="e.g., Web3 Conference 2024"
                      value={formData.nftName}
                      onChange={(e) => handleInputChange("nftName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nftSymbol">NFT Symbol *</Label>
                    <Input
                      id="nftSymbol"
                      placeholder="e.g., W3C24"
                      value={formData.nftSymbol}
                      onChange={(e) => handleInputChange("nftSymbol", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nftDescription">NFT Description</Label>
                  <Textarea
                    id="nftDescription"
                    placeholder="Describe the NFT reward..."
                    rows={3}
                    value={formData.nftDescription}
                    onChange={(e) => handleInputChange("nftDescription", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>NFT Image</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                    onClick={() => nftFileInputRef.current?.click()}
                  >
                    {nftImagePreview ? (
                      <div className="relative flex justify-center">
                        <img alt="NFT Preview" className="max-h-[200px] mx-auto rounded-lg object-cover" src={nftImagePreview} />
                        <Button className="absolute top-2 right-2" variant="secondary" size="sm" onClick={handleNftImageRemove}>
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-purple-500" />
                        <div className="text-lg font-semibold">Drag and drop or browse files</div>
                        <div className="text-xs text-muted-foreground">
                          Max size: 50MB
                          <br />
                          JPG, PNG, GIF, SVG
                        </div>
                      </div>
                    )}
                    <input ref={nftFileInputRef} accept="image/*" className="hidden" type="file" onChange={handleNftImageChange} />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• NFTs will be minted on Ethereum blockchain</li>
                    <li>• Each attendee will receive a unique NFT</li>
                    <li>• NFTs are non-transferable proof-of-attendance tokens</li>
                    <li>• Minting will happen automatically upon verified attendance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Create */}
          {step === 3 && (
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    Review Your Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Event Title</Label>
                        <p className="text-lg font-semibold">{formData.title}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Category</Label>
                        <Badge className="mt-1">{formData.category}</Badge>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Date & Time</Label>
                        <p>
                          {formData.date} at {formData.time}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Location</Label>
                        <p>{formData.location}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Max Attendees</Label>
                        <p>{formData.maxAttendees || "Unlimited"}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Event Type</Label>
                        <Badge variant={formData.eventType === "free" ? "default" : "secondary"}>
                          {formData.eventType === "free" ? "Free" : `Paid (${formData.registrationFee} ETH)`}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">NFT Reward</Label>
                        <p className="font-semibold">{formData.nftName}</p>
                        <p className="text-sm text-gray-600">Symbol: {formData.nftSymbol}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="mt-1">{formData.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-900">Blockchain Integration</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Smart contract deployment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>NFT collection creation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Registration tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Automatic NFT minting</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>

            <div className="flex gap-4">
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Event"}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}
