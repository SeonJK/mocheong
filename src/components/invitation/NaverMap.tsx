"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { invitationConfig } from "@/config/invitation";
import { naverMapSearchUrl } from "@/lib/naver-map";

type NaverMapsNamespace = {
  maps: {
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (
      el: HTMLElement,
      options: {
        center: unknown;
        zoom: number;
        scaleControl?: boolean;
        mapDataControl?: boolean;
        logoControl?: boolean;
      }
    ) => unknown;
    Marker: new (options: { position: unknown; map: unknown }) => unknown;
  };
};

declare global {
  interface Window {
    naver?: NaverMapsNamespace;
    __mocheongNaverMapScript?: Promise<void>;
  }
}

function loadNaverMaps(clientId: string) {
  if (window.naver?.maps) {
    return Promise.resolve();
  }

  if (window.__mocheongNaverMapScript) {
    return window.__mocheongNaverMapScript;
  }

  window.__mocheongNaverMapScript = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Naver Maps script failed"));
    document.head.appendChild(script);
  });

  return window.__mocheongNaverMapScript;
}

export function NaverMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const { venueName, hall, address, lat, lng } = invitationConfig.wedding;

  useEffect(() => {
    let mounted = true;

    if (!clientId || !mapRef.current) {
      setFailed(true);
      return;
    }

    loadNaverMaps(clientId)
      .then(() => {
        if (!mounted || !mapRef.current || !window.naver?.maps) {
          return;
        }

        const center = new window.naver.maps.LatLng(lat, lng);
        const map = new window.naver.maps.Map(mapRef.current, {
          center,
          zoom: 16,
          scaleControl: false,
          mapDataControl: false,
          logoControl: true
        });
        new window.naver.maps.Marker({ position: center, map });
      })
      .catch(() => {
        if (mounted) {
          setFailed(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [clientId, lat, lng]);

  if (failed) {
    return (
      <div className="map-fallback" role="region" aria-label="지도 대체 정보">
        <MapPin size={30} aria-hidden />
        <div>
          <strong>{venueName}</strong>
          <p>{hall}</p>
          <p>{address}</p>
          <a className="secondary-button map-link" href={naverMapSearchUrl()} target="_blank" rel="noreferrer">
            네이버지도 열기
            <ExternalLink size={16} aria-hidden />
          </a>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="naver-map" aria-label={`${venueName} 지도`} />;
}
