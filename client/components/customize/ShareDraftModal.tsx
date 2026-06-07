"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Link2,
  Mail,
  MessageSquare,
  Twitter,
  Facebook,
  Download,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ShareDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  designData: {
    groomName: string;
    brideName: string;
    eventDate: string;
    venue: string;
  };
  shareUrl?: string;
}

export default function ShareDraftModal({
  isOpen,
  onClose,
  designData,
  shareUrl,
}: ShareDraftModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [shareLink, setShareLink] = useState(shareUrl || window.location.href);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShareEmail = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    setSending(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Design shared with ${email}!`);
      setEmail("");
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = `Check out my wedding invitation design for ${designData.groomName} & ${designData.brideName}!`;
    const url = encodeURIComponent(shareLink);
    const encodedText = encodeURIComponent(text);

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${url}`;
        break;
    }
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden ring-1 ring-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">
              Share Your Design
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Design preview */}
            <div className="text-center p-4 bg-secondary/30 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Sharing:</p>
              <p className="font-display text-lg font-semibold">
                {designData.groomName} & {designData.brideName}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(designData.eventDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Copy link */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Shareable Link</label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-secondary/30"
                />
                <Button
                  variant={copied ? "default" : "elegant"}
                  onClick={handleCopyLink}
                  className="whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can view your design
              </p>
            </div>

            {/* Social sharing */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Share on Social</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { platform: "twitter", icon: Twitter, label: "X" },
                  { platform: "facebook", icon: Facebook, label: "Facebook" },
                  {
                    platform: "whatsapp",
                    icon: MessageSquare,
                    label: "WhatsApp",
                  },
                ].map(({ platform, icon: Icon, label }) => (
                  <Button
                    key={platform}
                    variant="elegant"
                    size="sm"
                    onClick={() => handleSocialShare(platform)}
                    className="flex flex-col items-center gap-1 py-3"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Email sharing */}
            <div className="space-y-3 pt-4 border-t border-border/30">
              <label className="text-sm font-medium">Send via Email</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="recipient@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleShareEmail}
                  disabled={sending || !email.trim()}
                >
                  {sending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="text-center p-4 bg-secondary/30 rounded-xl">
              <div className="w-24 h-24 mx-auto mb-2 bg-background rounded-lg border border-border/50 flex items-center justify-center">
                <Link2 className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="text-xs text-muted-foreground">
                QR code generation coming soon
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
