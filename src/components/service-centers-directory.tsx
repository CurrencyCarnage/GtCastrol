"use client";

import Script from "next/script";
import { LocateFixed, MapPin, Phone } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button, Card } from "@/components/ui";
import type { ServiceCenter } from "@/types/domain";

export function ServiceCentersDirectory({ centers }: { centers: ServiceCenter[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [scriptReady, setScriptReady] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id ?? "");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("Use your location to see the nearest approved service options.");

  const centersWithDistance = useMemo(() => {
    return centers
      .map((center) => ({
        center,
        distanceKm: userLocation ? calculateDistanceKm(userLocation, center.geolocation) : null,
      }))
      .sort((left, right) => {
        if (left.distanceKm === null && right.distanceKm === null) {
          return left.center.name.localeCompare(right.center.name);
        }

        if (left.distanceKm === null) {
          return 1;
        }

        if (right.distanceKm === null) {
          return -1;
        }

        return left.distanceKm - right.distanceKm;
      });
  }, [centers, userLocation]);

  useEffect(() => {
    if (!selectedCenterId && centersWithDistance.length) {
      setSelectedCenterId(centersWithDistance[0].center.id);
    }
  }, [centersWithDistance, selectedCenterId]);

  useEffect(() => {
    if (!scriptReady || !apiKey || !window.google || !mapElementRef.current) {
      return;
    }

    const google = window.google;
    const selectedCenter =
      centersWithDistance.find((entry) => entry.center.id === selectedCenterId)?.center ?? centersWithDistance[0]?.center;
    const fallbackCenter = selectedCenter?.geolocation ?? { lat: 41.7151, lng: 44.8271 };

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapElementRef.current, {
        center: userLocation ?? fallbackCenter,
        zoom: userLocation ? 8 : 7,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = centersWithDistance.map(({ center }) => {
      const marker = new google.maps.Marker({
        map: mapRef.current,
        position: center.geolocation,
        title: center.name,
      });

      marker.addListener("click", () => setSelectedCenterId(center.id));
      return marker;
    });

    if (userLocation) {
      markersRef.current.push(
        new google.maps.Marker({
          map: mapRef.current,
          position: userLocation,
          title: "Your location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#D61F26",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
            scale: 8,
          },
        }),
      );
    }

    if (selectedCenter) {
      mapRef.current.panTo(selectedCenter.geolocation);
      mapRef.current.setZoom(userLocation ? 10 : 8);
    }
  }, [apiKey, centersWithDistance, scriptReady, selectedCenterId, userLocation]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card tone="surface" className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--castrol-green-deep)]">Nearby service map</p>
            <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">
              Find the closest Castrol-ready service
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">{locationMessage}</p>
          </div>

          <Button
            type="button"
            onClick={() => {
              if (!navigator.geolocation) {
                setLocationMessage("Your browser does not support geolocation.");
                return;
              }

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  });
                  setLocationMessage("Showing the nearest service centers and approved affiliates around you.");
                },
                () => setLocationMessage("We could not access your location. You can still browse all approved service centers below."),
              );
            }}
          >
            <LocateFixed className="mr-2 h-4 w-4" />
            Use my location
          </Button>
        </div>

        {apiKey ? (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
            strategy="afterInteractive"
            onLoad={() => setScriptReady(true)}
          />
        ) : null}

        <div
          ref={mapElementRef}
          className="h-[28rem] rounded-[1.5rem] border border-[rgba(30,42,35,0.12)] bg-[linear-gradient(135deg,rgba(242,248,244,0.98),rgba(215,241,224,0.82)_55%,rgba(185,226,199,0.78))]"
        >
          {!apiKey ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-7 text-[var(--muted-foreground)]">
              Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to show the interactive service map here.
            </div>
          ) : null}
        </div>
      </Card>

      <Card tone="panel" className="space-y-4">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {centersWithDistance.length} service option(s), including approved affiliates.
        </p>

        <div className="max-h-[38rem] space-y-3 overflow-y-auto pr-1">
          {centersWithDistance.map(({ center, distanceKm }) => {
            const isSelected = center.id === selectedCenterId;

            return (
              <button
                key={center.id}
                type="button"
                onClick={() => setSelectedCenterId(center.id)}
                className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                  isSelected
                    ? "border-[rgba(12,107,52,0.3)] bg-white shadow-[0_16px_34px_rgba(30,42,35,0.12)]"
                    : "border-[rgba(30,42,35,0.12)] bg-white/80 hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-green-deep)]">
                      {center.source === "affiliate" ? "Approved affiliate" : `${center.city} / ${center.district}`}
                    </p>
                    <h4 className="font-sans text-2xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">
                      {center.name}
                    </h4>
                  </div>
                  {distanceKm !== null ? (
                    <span className="rounded-full border border-[rgba(30,42,35,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--castrol-red)]">
                      {distanceKm.toFixed(1)} km
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  <p className="flex gap-2">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--castrol-green-deep)]" />
                    <span>{center.address}</span>
                  </p>
                  <p className="flex gap-2">
                    <Phone className="mt-1 h-4 w-4 shrink-0 text-[var(--castrol-green-deep)]" />
                    <span>{center.phone}</span>
                  </p>
                  <p>{center.openingHours}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function calculateDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
