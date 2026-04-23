// ============= Campus Place Reviews =============
// Light, structured reviews for selected campus locations.
// Surfaces with images on the Map page when a building is selected.

export type PlaceReview = {
  id: string;
  author: string;
  rating: number; // 1–5
  text: string;
  postedISO: string;
};

export type PlaceProfile = {
  buildingId: number;
  images: string[];
  rating: number; // aggregate
  reviewCount: number;
  reviews: PlaceReview[];
  hours?: string;
  highlights?: string[];
};

const ago = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const placeProfiles: Record<number, PlaceProfile> = {
  // Main Library
  3: {
    buildingId: 3,
    rating: 4.6,
    reviewCount: 184,
    hours: "Mon–Fri 7:00 AM – 8:00 PM",
    highlights: ["Silent pods", "Power at every desk", "Strong Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568667256549-094345857637?w=900&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=70&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r-3-1",
        author: "Ama K.",
        rating: 5,
        text: "Quiet on the second floor — perfect for deep work. Group rooms book fast.",
        postedISO: ago(3),
      },
      {
        id: "r-3-2",
        author: "Yaw B.",
        rating: 4,
        text: "Great Wi-Fi. Could use a few more standing desks.",
        postedISO: ago(11),
      },
    ],
  },
  // ICT Lab
  4: {
    buildingId: 4,
    rating: 4.3,
    reviewCount: 92,
    hours: "Mon–Fri 8:00 AM – 6:00 PM",
    highlights: ["Workstations", "AC", "Projector"],
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=70&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r-4-1",
        author: "Kofi M.",
        rating: 5,
        text: "Workstations are responsive. Lab assistants are helpful.",
        postedISO: ago(5),
      },
    ],
  },
  // Admin Block
  5: {
    buildingId: 5,
    rating: 3.9,
    reviewCount: 67,
    hours: "Mon–Fri 8:00 AM – 4:30 PM",
    highlights: ["Bursary", "Registrar", "Student Affairs"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=70&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r-5-1",
        author: "Efua D.",
        rating: 4,
        text: "Use the Queue feature — saves a lot of standing time.",
        postedISO: ago(7),
      },
    ],
  },
  // Student Center
  8: {
    buildingId: 8,
    rating: 4.7,
    reviewCount: 213,
    hours: "Daily 7:00 AM – 10:00 PM",
    highlights: ["Cafe", "Lounge", "Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=70&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=70&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r-8-1",
        author: "Nana A.",
        rating: 5,
        text: "Best place to meet between classes. Great coffee.",
        postedISO: ago(2),
      },
    ],
  },
  // Sports Complex
  9: {
    buildingId: 9,
    rating: 4.5,
    reviewCount: 88,
    hours: "Daily 6:00 AM – 9:00 PM",
    highlights: ["Track", "Gym", "Football pitch"],
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=70&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: "r-9-1",
        author: "Akua P.",
        rating: 5,
        text: "Track is well-maintained. Evenings get busy.",
        postedISO: ago(9),
      },
    ],
  },
};

export function placeForBuilding(id: number): PlaceProfile | undefined {
  return placeProfiles[id];
}
