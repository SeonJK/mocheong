export type InvitationConfig = {
  couple: {
    groom: {
      name: string;
      phone: string;
      parents: string[];
    };
    bride: {
      name: string;
      phone: string;
      parents: string[];
    };
  };
  wedding: {
    dateTime: string;
    venueName: string;
    hall: string;
    address: string;
    lat: number;
    lng: number;
    rsvpDueDate: string;
  };
  copy: {
    heroTitle: string;
    greetingTitle: string;
    greeting: string[];
    quote: string;
    closing: string[];
  };
  images: {
    og: string;
    cover: string;
    gallery: string[];
  };
  accounts: Array<{
    side: "groom" | "bride";
    label: string;
    bank: string;
    number: string;
    holder: string;
  }>;
  notices: string[];
  transport: {
    parking: string[];
    naverMapUrl: string;
    kakaoNaviUrl?: string;
    tmapUrl?: string;
  };
};

export const invitationConfig: InvitationConfig = {
  couple: {
    groom: {
      name: "윤준수",
      phone: "010-0000-0000",
      parents: ["이민호", "박정희"]
    },
    bride: {
      name: "차수민",
      phone: "010-0000-0000",
      parents: ["김도윤", "한서연"]
    }
  },
  wedding: {
    dateTime: "2026-10-24T14:00:00+09:00",
    venueName: "라비에벨",
    hall: "8층 오페라홀",
    address: "서울 강남구 테헤란로 521",
    lat: 37.50933,
    lng: 127.06138,
    rsvpDueDate: "2026-10-10"
  },
  copy: {
    heroTitle: "저희의 시작을 함께 축복해주세요",
    greetingTitle: "저희의 시작을 함께 축복해주세요",
    greeting: [
      "서로가 마주 보면 다정한 사람이 되어",
      "이제 함께 한 곳을 바라보며 걸어가고자 합니다.",
      "저희의 새로운 시작을 따뜻한 마음으로 축복해 주시면 감사하겠습니다."
    ],
    quote: "깊이 감사드리며 행복한 시작으로 보답하겠습니다.",
    closing: [
      "귀한 발걸음 해주시는 모든 분들께",
      "깊이 감사드리며 행복한 시작으로 보답하겠습니다."
    ]
  },
  images: {
    og: "/images/og.png",
    cover: "/images/cover.png",
    gallery: ["/images/gallery-1.png", "/images/gallery-2.png", "/images/gallery-3.png"]
  },
  accounts: [
    {
      side: "groom",
      label: "신랑",
      bank: "카카오뱅크",
      number: "3333-12-3456789",
      holder: "윤준수"
    },
    {
      side: "bride",
      label: "신부",
      bank: "신한은행",
      number: "110-123-456789",
      holder: "차수민"
    }
  ],
  notices: [
    "화환은 마음만 감사히 받겠습니다.",
    "예식장 로비에서 혼주 안내를 받으실 수 있습니다."
  ],
  transport: {
    parking: [
      "호텔 내 주차장 이용이 가능합니다.",
      "예식 참석 하객분들은 3시간 무료 주차가 지원됩니다."
    ],
    naverMapUrl:
      "https://map.naver.com/p/search/%EA%B7%B8%EB%9E%9C%EB%93%9C%20%EC%9D%B8%ED%84%B0%EC%BB%A8%ED%8B%B0%EB%84%A8%ED%83%88%20%EC%84%9C%EC%9A%B8%20%ED%8C%8C%EB%A5%B4%EB%82%98%EC%8A%A4"
  }
};

export const weddingDate = new Date(invitationConfig.wedding.dateTime);

export function formatWeddingDate() {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Seoul"
  }).format(weddingDate);
}
