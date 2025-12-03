export interface Event {
  id: string
  title: string
  description: string
  longDescription: string
  date: string
  time: string
  location: string
  venue: string
  image: string
  price: number
  currency: string
  availableTickets: number
  category: "workshop" | "celebration" | "masterclass" | "experience"
  highlights: string[]
}

export const events: Event[] = [
  {
    id: "gift-wrapping-masterclass",
    title: "Gift Wrapping Masterclass",
    description: "Learn the art of luxury gift wrapping from our expert curators.",
    longDescription:
      "Join us for an exclusive hands-on workshop where you'll master the art of luxury gift presentation. Learn professional techniques for wrapping, ribbon tying, and creating stunning gift toppers. All materials provided, and you'll take home your own curated wrapping kit.",
    date: "December 15, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Lagos, Nigeria",
    venue: "ÈBÙN Studio, Victoria Island",
    image: "/elegant-gift-wrapping-workshop-with-ribbons-and-lu.jpg",
    price: 25000,
    currency: "₦",
    availableTickets: 20,
    category: "masterclass",
    highlights: [
      "Professional wrapping techniques",
      "Luxury materials kit included",
      "Certificate of completion",
      "Refreshments provided",
    ],
  },
  {
    id: "holiday-gift-market",
    title: "Holiday Gift Market",
    description: "Exclusive preview of our holiday collection with live demonstrations.",
    longDescription:
      "Experience the magic of the season at our exclusive Holiday Gift Market. Preview our limited-edition holiday collections, enjoy live gift-wrapping demonstrations, and receive personalized recommendations from our gift curators. Complimentary champagne and canapés included.",
    date: "December 20, 2025",
    time: "12:00 PM - 8:00 PM",
    location: "Lagos, Nigeria",
    venue: "The Wheatbaker Hotel, Ikoyi",
    image: "/luxurious-holiday-gift-market-with-elegant-decorat.jpg",
    price: 15000,
    currency: "₦",
    availableTickets: 100,
    category: "experience",
    highlights: [
      "Early access to holiday collections",
      "Live gift-wrapping demos",
      "Personal shopping assistance",
      "Champagne & canapés",
    ],
  },
  {
    id: "couples-gift-curation",
    title: "Couples Gift Curation Evening",
    description: "A romantic evening learning to curate thoughtful gifts together.",
    longDescription:
      "Perfect for couples who want to create meaningful gifts for each other or for loved ones. This intimate workshop guides you through the art of thoughtful gift curation, from understanding preferences to creating personalized gift boxes. End the evening with a romantic dinner.",
    date: "February 10, 2026",
    time: "6:00 PM - 10:00 PM",
    location: "Lagos, Nigeria",
    venue: "ÈBÙN Private Lounge, Lekki",
    image: "/romantic-couples-workshop-elegant-setting-candles.jpg",
    price: 75000,
    currency: "₦",
    availableTickets: 12,
    category: "workshop",
    highlights: [
      "Intimate setting for couples",
      "Create gifts for each other",
      "4-course dinner included",
      "Take home your creations",
    ],
  },
  {
    id: "corporate-gifting-seminar",
    title: "Corporate Gifting Seminar",
    description: "Elevate your company's gifting strategy with expert insights.",
    longDescription:
      "Designed for HR professionals, executive assistants, and business owners. Learn how to create impactful corporate gifting programs that strengthen client relationships and boost employee morale. Includes case studies, best practices, and exclusive corporate pricing information.",
    date: "January 25, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "Lagos, Nigeria",
    venue: "Radisson Blu, Ikeja",
    image: "/professional-corporate-seminar-elegant-conference-.jpg",
    price: 35000,
    currency: "₦",
    availableTickets: 50,
    category: "masterclass",
    highlights: [
      "Corporate gifting strategies",
      "Exclusive B2B pricing",
      "Networking lunch included",
      "Resource materials provided",
    ],
  },
  {
    id: "mothers-day-celebration",
    title: "Mother's Day Celebration",
    description: "Celebrate the special women in your life with an unforgettable event.",
    longDescription:
      "Treat your mother, grandmother, or any special woman to an afternoon of pampering and appreciation. Enjoy spa treatments, a curated gift-making session where you create a personalized gift box, high tea service, and live music. A celebration of love and gratitude.",
    date: "March 30, 2026",
    time: "1:00 PM - 6:00 PM",
    location: "Lagos, Nigeria",
    venue: "Four Points by Sheraton, VI",
    image: "/elegant-mothers-day-celebration-with-flowers-and-t.jpg",
    price: 50000,
    currency: "₦",
    availableTickets: 60,
    category: "celebration",
    highlights: ["Mini spa treatments", "Create a gift for mom", "High tea service", "Live music performance"],
  },
  {
    id: "kids-gift-making-workshop",
    title: "Kids Gift Making Workshop",
    description: "Fun and creative workshop for children to make gifts for loved ones.",
    longDescription:
      "A delightful workshop designed for children ages 6-12. Kids will learn the joy of giving by creating handmade gifts for family members. Activities include card making, simple gift wrapping, and decorating gift boxes. Supervised by trained facilitators with all materials provided.",
    date: "December 22, 2025",
    time: "10:00 AM - 1:00 PM",
    location: "Lagos, Nigeria",
    venue: "ÈBÙN Studio, Victoria Island",
    image: "/children-craft-workshop-colorful-gift-making.jpg",
    price: 20000,
    currency: "₦",
    availableTickets: 25,
    category: "workshop",
    highlights: ["Age-appropriate activities", "All materials included", "Trained supervisors", "Snacks provided"],
  },
]

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id)
}

export function getEventsByCategory(category: Event["category"]): Event[] {
  return events.filter((event) => event.category === category)
}
