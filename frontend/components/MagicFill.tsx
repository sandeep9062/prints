"use client";

import React, { useState, useCallback } from "react";
import {
  Button,
  Textarea,
  Group,
  Text,
  Paper,
  Stack,
  List,
} from "@mantine/core";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface MagicFillProps {
  nextStep: () => void;
  /** Free-form print brief this step pre-fills. */
  printDetails: Record<string, unknown>;
  setPrintDetails: React.Dispatch<
    React.SetStateAction<Record<string, unknown>>
  >;
}

/**
 * Heuristic field extractor for a pasted print brief.
 *
 * Runs entirely in the browser — no AI service involved. It scans the pasted
 * text for the handful of things we can recognise deterministically
 * (quantity, paper GSM, finishing, colour, deadline) and returns ONLY the keys
 * it actually found, so the caller can merge over existing values without
 * blanking anything the user already typed.
 */
const FINISHING_TERMS = [
  "foil",
  "emboss",
  "spot uv",
  "matte lamination",
  "glossy lamination",
  "die-cut",
  "die cut",
  "letterpress",
  "varnish",
];

const COLOUR_TERMS = [
  "black and white",
  "black & white",
  "full colour",
  "full color",
];

const CATEGORY_TERMS: Record<string, string> = {
  "wedding card": "wedding-cards",
  "wedding invitation": "wedding-cards",
  "visiting card": "visiting-cards",
  "business card": "visiting-cards",
  shagun: "shagun-envelopes",
  "letter pad": "letter-pads",
  notepad: "letter-pads",
  brochure: "brochures",
  catalogue: "brochures",
  catalog: "brochures",
  banner: "banners",
  flex: "banners",
  sticker: "stickers",
  label: "stickers",
  stamp: "rubber-stamps",
  "book binding": "books-bindings",
  "spiral binding": "books-bindings",
};

export function extractPrintFields(rawText: string): Record<string, unknown> {
  const text = rawText.toLowerCase();
  const fields: Record<string, unknown> = {};

  // Quantity: "500 cards", "qty 250", "1000 pieces"
  const qtyMatch = rawText.match(
    /\b(?:qty|quantity)?\s*[:\-]?\s*(\d[\d,]{0,7})\s*(?:cards?|pieces?|nos?\.?|units?|sets?|invitations?|copies)?\b/i,
  );
  if (qtyMatch) {
    const n = Number(qtyMatch[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0) fields.quantity = n;
  }

  // Paper weight in gsm
  const gsmMatch = text.match(/\b(\d{2,3})\s*gsm\b/);
  if (gsmMatch) fields.paperGsm = Number(gsmMatch[1]);

  // Finishing techniques mentioned
  const finishes = FINISHING_TERMS.filter((term) => text.includes(term));
  if (finishes.length) fields.finishing = [...new Set(finishes)].join(", ");

  // Colour mode
  const colour = COLOUR_TERMS.find((term) => text.includes(term));
  if (colour) fields.colour = colour;

  // Product category — first taxonomy term that appears
  const hit = Object.keys(CATEGORY_TERMS).find((term) => text.includes(term));
  if (hit) fields.categorySlug = CATEGORY_TERMS[hit];

  // Delivery deadline
  const deadlineMatch = rawText.match(
    /\b(?:by|before|needed\s+by|deadline)\s+(\d{1,2}(?:st|nd|rd|th)?\s+\w+|\d{1,2}[/-]\d{1,2})/i,
  );
  if (deadlineMatch) fields.deadline = deadlineMatch[1].trim();

  return fields;
}
/*BODY*/

const MagicFill = ({
  nextStep,
  printDetails: _details,
  setPrintDetails,
}: MagicFillProps) => {
  const [rawText, setRawText] = useState("");

  const applyAndContinue = useCallback(
    (text: string) => {
      const fields = extractPrintFields(text);
      const keys = Object.keys(fields);

      if (keys.length === 0) {
        toast.error(
          "Could not detect any print details. Try mentioning quantity, GSM or finishing.",
        );
        return;
      }

      // Merge over the existing brief — never blank what the user typed.
      setPrintDetails((prev) => ({ ...prev, ...fields }));
      toast.success(
        `Filled ${keys.length} field${keys.length === 1 ? "" : "s"} — review before continuing.`,
      );
      nextStep();
    },
    [setPrintDetails, nextStep],
  );

  const handleMagic = () => {
    const text = rawText.trim();
    if (!text) return;
    applyAndContinue(text);
  };

  return (
    <div className="py-4">
      <Stack gap="lg">
        <Paper
          p="md"
          withBorder
          className="bg-gradient-to-br from-brand-soft/90 to-card/50 border-border/80 rounded-2xl"
        >
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <Sparkles size={24} className="text-brand" />
              <Text fw={800} size="lg" className="text-foreground tracking-tight">
                Quick Brief Fill
              </Text>
            </Group>
          </Group>
          <Text size="sm" c="dimmed" fw={500} mb="sm">
            Paste rough notes, a WhatsApp message or an old order text. We pull
            out what we can read automatically — quantity, paper GSM, finishing,
            colour and deadline — and drop it into your brief.
          </Text>
          <List
            size="sm"
            c="dimmed"
            spacing={4}
            icon={<Wand2 size={14} className="text-brand" />}
          >
            <List.Item>
              Reads quantities like &ldquo;500 cards&rdquo; or &ldquo;qty
              1000&rdquo;
            </List.Item>
            <List.Item>
              Detects paper weight, finishing and colour mode where mentioned
            </List.Item>
            <List.Item>
              Matches your text to a printing category so the right template
              opens — you can still edit every field
            </List.Item>
          </List>
        </Paper>
        <Textarea
          placeholder={
            "Example:\nNeed 500 wedding cards, 300 gsm matte with gold foil, full colour.\nBoth sides printed. Delivery needed by 15th."
          }
          label={
            <Text fw={700} size="sm" mb={5} c="gray.7">
              Paste your print brief
            </Text>
          }
          minRows={8}
          autosize
          maxRows={28}
          styles={{
            input: {
              fontSize: "14px",
              padding: "20px",
              lineHeight: 1.6,
              borderRadius: "16px",
              backgroundColor: "hsl(var(--card))",
              border: "2px solid hsl(var(--border))",
              "&:focus": { borderColor: "hsl(var(--brand))" },
            },
          }}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />

        <Group justify="space-between">
          <Button
            variant="subtle"
            color="hsl(var(--brand))"
            onClick={nextStep}
            size="md"
            radius="md"
          >
            Skip — I&rsquo;ll fill manually
          </Button>

          <Button
            onClick={handleMagic}
            disabled={!rawText.trim()}
            size="md"
            radius="md"
            leftSection={<Wand2 size={18} />}
            className="bg-brand hover:bg-brand-hover shadow-lg shadow-brand-soft/80 px-8"
          >
            Fill my brief
          </Button>
        </Group>

        <Text size="xs" c="dimmed" ta="center">
          Everything is detected on your device — nothing is uploaded.
        </Text>
      </Stack>
    </div>
  );
};


export default MagicFill;
