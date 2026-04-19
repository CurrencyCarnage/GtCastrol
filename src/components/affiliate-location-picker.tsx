"use client";

import Script from "next/script";
import { MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button, Input } from "@/components/ui";

const defaultCenter = { lat: 41.7151, lng: 44.8271 };

export function AffiliateLocationPicker({
  address,
  error,
  onAddressChange,
  onLocationChange,
}: {
  address: string;
  error?: string;
  onAddressChange: (nextValue: string) => void;
  onLocationChange: (payload: {
    address: string;
    googlePlaceId?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    apiKey
      ? "Search for your service address or click directly on the map to pin your location."
      : "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable map pinning for affiliate registrations.",
  );

  useEffect(() => {
    if (!scriptReady || !apiKey || !window.google || !inputRef.current || !mapElementRef.current || mapRef.current) {
      return;
    }

    const google = window.google;
    const map = new google.maps.Map(mapElementRef.current, {
      center: defaultCenter,
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new google.maps.Marker({
      map,
      position: defaultCenter,
      draggable: true,
      visible: false,
    });

    const geocoder = new google.maps.Geocoder();
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "geometry", "name", "place_id"],
    });

    mapRef.current = map;
    markerRef.current = marker;
    geocoderRef.current = geocoder;
    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = place?.geometry?.location;

      if (!location) {
        setStatusMessage("We couldn't resolve that address. Try a more specific search or place the pin manually.");
        return;
      }

      const nextAddress = place.formatted_address || place.name || address;
      updateSelection({
        address: nextAddress,
        googlePlaceId: place.place_id,
        latitude: location.lat(),
        longitude: location.lng(),
      });
    });

    marker.addListener("dragend", (event: any) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return;
      }

      reverseGeocode(lat, lng);
    });

    map.addListener("click", (event: any) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return;
      }

      reverseGeocode(lat, lng);
    });

    function reverseGeocode(lat: number, lng: number) {
      geocoder.geocode({ location: { lat, lng } }, (results: any[] = [], status: string) => {
        if (status !== "OK" || !results.length) {
          updateSelection({
            address,
            latitude: lat,
            longitude: lng,
          });
          setStatusMessage("Pin saved. Add the street address text if Google could not reverse-geocode this point.");
          return;
        }

        const bestResult = results[0];
        updateSelection({
          address: bestResult.formatted_address,
          googlePlaceId: bestResult.place_id,
          latitude: lat,
          longitude: lng,
        });
      });
    }

    function updateSelection(payload: {
      address: string;
      googlePlaceId?: string;
      latitude: number;
      longitude: number;
    }) {
      const position = { lat: payload.latitude, lng: payload.longitude };

      marker.setVisible(true);
      marker.setPosition(position);
      map.panTo(position);
      map.setZoom(14);
      onLocationChange(payload);
      setStatusMessage("Location pinned successfully. Nearby users will be able to find this service on the map.");
    }
  }, [address, apiKey, onLocationChange, scriptReady]);

  return (
    <div className="space-y-3">
      {apiKey ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
      ) : null}

      <div className="space-y-2">
        <label htmlFor="affiliate-address-search" className="text-sm font-semibold text-[var(--foreground)]">
          Service address
        </label>
        <Input
          ref={inputRef}
          id="affiliate-address-search"
          value={address}
          placeholder="Search your service on Google Maps"
          onChange={(event) => onAddressChange(event.target.value)}
        />
      </div>

      <div className="rounded-[1.5rem] border border-[rgba(30,42,35,0.12)] bg-white p-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-sm leading-6 text-[var(--muted-foreground)]">{statusMessage}</p>
          {apiKey ? (
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 px-3 py-2 text-xs"
              onClick={() => {
                if (!navigator.geolocation) {
                  setStatusMessage("Your browser does not support geolocation.");
                  return;
                }

                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    onLocationChange({
                      address,
                      latitude,
                      longitude,
                    });

                    if (mapRef.current && markerRef.current) {
                      const point = { lat: latitude, lng: longitude };
                      markerRef.current.setVisible(true);
                      markerRef.current.setPosition(point);
                      mapRef.current.panTo(point);
                      mapRef.current.setZoom(14);
                    }

                    setStatusMessage("Current location pinned. You can still drag the marker to adjust it.");
                  },
                  () => setStatusMessage("We couldn't access your current location. Search or click on the map instead."),
                );
              }}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Use my location
            </Button>
          ) : null}
        </div>

        <div
          ref={mapElementRef}
          className="h-[18rem] rounded-[1.25rem] border border-[rgba(30,42,35,0.1)] bg-[linear-gradient(135deg,rgba(242,248,244,0.98),rgba(215,241,224,0.82)_55%,rgba(185,226,199,0.78))]"
        >
          {!apiKey ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-[var(--muted-foreground)]">
              <div className="space-y-2">
                <MapPin className="mx-auto h-5 w-5 text-[var(--castrol-green-deep)]" />
                <p>Map preview is waiting for a Google Maps browser key.</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
