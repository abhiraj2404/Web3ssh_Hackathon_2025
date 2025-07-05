"use client";
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { useActiveAccount } from "thirdweb/react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WalletUserContextType {
  account: any;
  user: any;
  loading: boolean;
  showNameModal: boolean;
  setShowNameModal: React.Dispatch<React.SetStateAction<boolean>>;
  setName: (name: string) => Promise<void>;
}

const WalletUserContext = createContext<WalletUserContextType | undefined>(undefined);

export function WalletUserProvider({ children }: PropsWithChildren) {
  const account = useActiveAccount();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    if (account?.address) {
      fetchUser(account.address);
    } else {
      setUser(null);
      setShowNameModal(false);
      setNameInput("");
    }
  }, [account?.address]);

  const fetchUser = async (walletAddress: string) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users", { params: { walletAddress } });
      if (res.data && res.data.name) {
        setUser(res.data);
        setShowNameModal(false);
      } else {
        setUser(null);
        setShowNameModal(true);
      }
    } catch (err) {
      setUser(null);
      setShowNameModal(true);
    }
    setLoading(false);
  };

  const setName = async (name: string) => {
    if (!account?.address) return;
    setLoading(true);
    try {
      // Create user with walletAddress and name
      const res = await axios.post("/api/users", { walletAddress: account.address, name });
      setUser(res.data);
      setShowNameModal(false);
    } catch (err) {
      // Optionally handle error (e.g., show toast)
    }
    setLoading(false);
  };

  return (
    <WalletUserContext.Provider value={{ account, user, loading, showNameModal, setShowNameModal, setName }}>
      {children}
      <Dialog open={showNameModal} onOpenChange={setShowNameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your name</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (nameInput.trim()) setName(nameInput.trim());
            }}
            className="space-y-4"
          >
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              required
              disabled={loading}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !nameInput.trim()}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </WalletUserContext.Provider>
  );
}

export function useWalletUser() {
  const ctx = useContext(WalletUserContext);
  if (!ctx) throw new Error("useWalletUser must be used within WalletUserProvider");
  return ctx;
}
