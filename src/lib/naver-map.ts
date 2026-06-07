import { invitationConfig } from "@/config/invitation";

export function naverMapSearchUrl() {
  return invitationConfig.transport.naverMapUrl;
}

export function kakaoNaviUrl() {
  const { venueName, address } = invitationConfig.wedding;
  const encodedName = encodeURIComponent(venueName);
  const encodedAddress = encodeURIComponent(address);
  return `https://map.kakao.com/link/search/${encodedName}%20${encodedAddress}`;
}

export function tmapUrl() {
  const { venueName, lat, lng } = invitationConfig.wedding;
  return `https://apis.openapi.sk.com/tmap/app/routes?name=${encodeURIComponent(venueName)}&lon=${lng}&lat=${lat}`;
}
