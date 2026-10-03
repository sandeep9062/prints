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
import { useMagicFillMutation } from "@/services/aiBasedApi";

interface MagicFillProps {
  nextStep: () => void;
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
  normalizeCountry?: (raw: string) => string;
}

function mergeAiIntoPropertyDetails(
  prev: any,
  ai: Record<string, any>,
  normalizeCountry: (c: string) => string,
) {
  const loc = ai.location && typeof ai.location === "object" ? ai.location : {};
  const hasLatLng =
    loc.coordinates &&
    typeof loc.coordinates.lat === "number" &&
    typeof loc.coordinates.lng === "number" &&
    (loc.coordinates.lat !== 0 || loc.coordinates.lng !== 0);
  const coords = hasLatLng
    ? { lat: loc.coordinates.lat, lng: loc.coordinates.lng }
    : prev.location?.coordinates;

  const np =
    ai.nearbyPlaces && typeof ai.nearbyPlaces === "object"
      ? ai.nearbyPlaces
      : null;
  const nearbyPlaces = np
    ? {
        schools: np.schools?.length
          ? np.schools
          : (prev.nearbyPlaces?.schools ?? []),
        metroStations: np.metroStations?.length
          ? np.metroStations
          : (prev.nearbyPlaces?.metroStations ?? []),
        hospitals: np.hospitals?.length
          ? np.hospitals
          : (prev.nearbyPlaces?.hospitals ?? []),
        malls: np.malls?.length ? np.malls : (prev.nearbyPlaces?.malls ?? []),
      }
    : prev.nearbyPlaces;

  const fac =
    ai.facilities && typeof ai.facilities === "object" ? ai.facilities : null;

  const merged: Record<string, any> = {
    ...prev,
    title: (typeof ai.title === "string" && ai.title.trim()) || prev.title,
    description:
      (typeof ai.description === "string" && ai.description.trim()) ||
      prev.description,
    price:
      typeof ai.price === "number" && Number.isFinite(ai.price) && ai.price > 0
        ? ai.price
        : prev.price,
    deal: ai.deal || prev.deal,
    type: ai.type || prev.type,
    propertyCategory: ai.propertyCategory || prev.propertyCategory,
    availability: ai.availability || prev.availability,
    furnishing: ai.furnishing || prev.furnishing,
    facing:
      typeof ai.facing === "string" && ai.facing.trim() !== ""
        ? ai.facing
        : prev.facing,
    postedBy: ai.postedBy || prev.postedBy,
    listingAvailability: ai.listingAvailability || prev.listingAvailability,
    area:
      ai.area && typeof ai.area === "object" && ai.area.value != null
        ? { ...prev.area, ...ai.area }
        : prev.area,
    location: {
      ...prev.location,
      ...loc,
      country: normalizeCountry(
        (typeof loc.country === "string" && loc.country) ||
          prev.location?.country ||
          "",
      ),
      coordinates: coords ?? prev.location?.coordinates,
    },
    facilities: fac ? { ...prev.facilities, ...fac } : prev.facilities,
    reraNumber:
      (typeof ai.reraNumber === "string" && ai.reraNumber.trim()) ||
      prev.reraNumber,
    virtualTourUrl:
      (typeof ai.virtualTourUrl === "string" && ai.virtualTourUrl.trim()) ||
      prev.virtualTourUrl,
    videoUrl:
      (typeof ai.videoUrl === "string" && ai.videoUrl.trim()) || prev.videoUrl,
    nearbyPlaces,
    commercialPropertyTypes:
      Array.isArray(ai.commercialPropertyTypes) &&
      ai.commercialPropertyTypes.length
        ? ai.commercialPropertyTypes
        : prev.commercialPropertyTypes,
    investmentOptions:
      Array.isArray(ai.investmentOptions) && ai.investmentOptions.length
        ? ai.investmentOptions
        : prev.investmentOptions,
  };

  if (ai.maintenanceCharge != null)
    merged.maintenanceCharge = ai.maintenanceCharge;
  if (ai.securityDeposit != null) merged.securityDeposit = ai.securityDeposit;
  if (ai.lockInMonths != null) merged.lockInMonths = ai.lockInMonths;
  if (ai.noticePeriodDays != null)
    merged.noticePeriodDays = ai.noticePeriodDays;
  if (ai.ageOfProperty != null) merged.ageOfProperty = ai.ageOfProperty;
  if (ai.pricePerSqft != null) merged.pricePerSqft = ai.pricePerSqft;
  if (typeof ai.negotiable === "boolean") merged.negotiable = ai.negotiable;

  if (
    ai.ocStatus !== undefined &&
    ai.ocStatus !== null &&
    String(ai.ocStatus).trim() !== ""
  ) {
    merged.ocStatus = ai.ocStatus;
  }

  if (ai.constructionStatus && typeof ai.constructionStatus === "object") {
    merged.constructionStatus = {
      ...prev.constructionStatus,
      ...ai.constructionStatus,
    };
  }

  if (Array.isArray(ai.amenities) && ai.amenities.length > 0) {
    merged.amenities = ai.amenities;
  }

  if (ai.floor != null && Number.isFinite(Number(ai.floor))) {
    merged.floor = Math.max(0, Math.round(Number(ai.floor)));
  }

  return merged;
}

const MagicFill = ({
  nextStep,
  propertyDetails: _details,
  setPropertyDetails,
  normalizeCountry = (s: string) => s || "",
}: MagicFillProps) => {
  const [rawText, setRawText] = useState("");
  const [magicFill, { isLoading }] = useMagicFillMutation();

  const applyAndContinue = useCallback(
    async (text: string) => {
      const result = await magicFill(text).unwrap();
      if (!result.success || !result.data) {
        toast.error("Could not read listing from AI. Try again.");
        return;
      }
      const aiData = result.data;
      setPropertyDetails((prev: any) =>
        mergeAiIntoPropertyDetails(prev, aiData, normalizeCountry),
      );
      const filled: string[] = [];
      if (aiData.title) filled.push("title");
      if (aiData.description) filled.push("description");
      if (aiData.price) filled.push("price");
      if (aiData.location?.city) filled.push("location");
      if (aiData.area?.value) filled.push("area");
      if (
        aiData.facilities &&
        typeof aiData.facilities === "object" &&
        Object.values(aiData.facilities).some(
          (v) =>
            v !== undefined &&
            v !== null &&
            v !== "" &&
            !(typeof v === "number" && v === 0),
        )
      ) {
        filled.push("facilities");
      }
      if ((aiData.amenities as string[])?.length) filled.push("amenities");
      toast.success(
        filled.length
          ? `Filled ${filled.length} sections — review location & images next.`
          : "Applied — please complete key fields manually.",
      );
      nextStep();
    },
    [magicFill, setPropertyDetails, nextStep, normalizeCountry],
  );

  const handleAiMagic = async () => {
    const text = rawText.trim();
    if (!text) return;
    try {
      await applyAndContinue(text);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; status?: number };
      const msg =
        err?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Magic fill failed. Try again.");
      toast.error(msg);
    }
  };

  return (
    <div className="py-4">
      <Stack gap="lg">
        <Paper
          p="md"
          withBorder
          className="bg-gradient-to-br from-blue-50/90 to-indigo-50/50 border-blue-100/80 rounded-2xl"
        >
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <Sparkles size={24} className="text-blue-600" />
              <Text fw={800} size="lg" className="text-blue-950 tracking-tight">
                AI Magic Fill
              </Text>
            </Group>
          </Group>
          <Text size="sm" c="dimmed" fw={500} mb="sm">
            Paste rough notes, broker messages, or an old listing. We extract
            structured fields (deal, price in INR, BHK, area, rent terms, OC,
            amenities, neighbourhood hints) and normalize them for your form.
          </Text>
          <List
            size="sm"
            c="dimmed"
            spacing={4}
            icon={<Wand2 size={14} className="text-blue-500" />}
          >
            <List.Item>
              Understands lakhs / crore and monthly rent vs sale price
            </List.Item>
            <List.Item>
              Maps BHK, parking type, maintenance, deposit, lock-in where
              mentioned
            </List.Item>
            <List.Item>
              Match amenities to your listing checklist — you can still edit
              every step
            </List.Item>
          </List>
        </Paper>

        <Textarea
          placeholder={`Example:\n3BHK + study, 18th floor, DLF Phase 3 Gurgaon. 1850 sq ft, East facing, 2 covered parking.\nAsking 2.35 cr, negotiable. Maintenance ₹8500/mo. OC available. Gym, pool, clubhouse.\nNear Rapid Metro & Galleria.`}
          label={
            <Text fw={700} size="sm" mb={5} c="gray.7">
              Paste property text
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
              backgroundColor: "#fff",
              border: "2px solid #e9ecef",
              "&:focus": { borderColor: "#4161df" },
            },
          }}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          disabled={isLoading}
        />

        <Group justify="space-between">
          <Button
            variant="subtle"
            color="#4161df"
            onClick={nextStep}
            size="md"
            radius="md"
          >
            Skip — I’ll fill manually
          </Button>

          <Button
            onClick={handleAiMagic}
            loading={isLoading}
            disabled={!rawText.trim()}
            size="md"
            radius="md"
            leftSection={!isLoading && <Wand2 size={18} />}
            className="bg-[#4161df] hover:bg-[#3a56c4] shadow-lg shadow-blue-100/80 px-8"
          >
            {isLoading ? "Extracting…" : "Run magic fill"}
          </Button>
        </Group>

        <Text size="xs" c="dimmed" ta="center">
          Pin location on the map in the next steps if coordinates weren’t
          guessed. Photos still upload separately.
        </Text>
      </Stack>
    </div>
  );
};

export default MagicFill;
