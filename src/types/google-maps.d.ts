export {};

declare global {
  type GoogleMapsLatLngLiteral = { lat: number; lng: number };

  interface GoogleMapsLatLng {
    lat(): number;
    lng(): number;
  }

  interface GoogleMapsMapMouseEvent {
    latLng?: GoogleMapsLatLng;
  }

  interface GoogleMapsMap {
    panTo(position: GoogleMapsLatLngLiteral): void;
    setZoom(zoom: number): void;
    addListener(eventName: string, handler: (event: GoogleMapsMapMouseEvent) => void): void;
  }

  interface GoogleMapsMarker {
    setMap(map: GoogleMapsMap | null): void;
    setPosition(position: GoogleMapsLatLngLiteral): void;
    setVisible(visible: boolean): void;
    addListener(eventName: string, handler: (event: GoogleMapsMapMouseEvent) => void): void;
  }

  interface GoogleMapsGeocoderResult {
    formatted_address: string;
    place_id?: string;
  }

  interface GoogleMapsGeocoder {
    geocode(
      request: { location: GoogleMapsLatLngLiteral },
      callback: (results: GoogleMapsGeocoderResult[] | null, status: string) => void,
    ): void;
  }

  interface GoogleMapsPlaceResult {
    formatted_address?: string;
    geometry?: { location?: GoogleMapsLatLng };
    name?: string;
    place_id?: string;
  }

  interface GoogleMapsAutocomplete {
    getPlace(): GoogleMapsPlaceResult;
    addListener(eventName: string, handler: () => void): void;
  }

  interface GoogleMapsNamespace {
    maps: {
      Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMapsMap;
      Marker: new (options: Record<string, unknown>) => GoogleMapsMarker;
      Geocoder: new () => GoogleMapsGeocoder;
      SymbolPath: { CIRCLE: string | symbol };
      places: {
        Autocomplete: new (input: HTMLInputElement, options: Record<string, unknown>) => GoogleMapsAutocomplete;
      };
    };
  }

  interface Window {
    google?: GoogleMapsNamespace;
  }
}
