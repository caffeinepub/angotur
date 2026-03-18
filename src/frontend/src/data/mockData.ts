import {
  BookingStatus,
  FeeStatus,
  Type,
  Type__1,
  Variant_spot_guide,
} from "../backend.d";
import type { Booking, Review, TourGuide, TouristSpot } from "../backend.d";

export const MOCK_SPOTS: TouristSpot[] = [
  {
    id: "spot-1",
    name: "Quedas do Kalandula",
    description:
      "Uma das maiores quedas d'água de África, com cerca de 105 metros de altura e 400 metros de largura. Localizada no rio Lucala, é um espetáculo natural deslumbrante rodeado de floresta tropical exuberante.",
    category: Type.nature,
    location: "Malanje, Angola",
    status: Type__1.approved,
    photos: [],
    platformFee: BigInt(0),
    feeStatus: FeeStatus.paid,
    isPrivate: false,
  },
  {
    id: "spot-2",
    name: "Praia do Mussulo",
    description:
      "Uma bela península de areia dourada que se estende por vários quilômetros, com águas cristalinas do Atlântico. O Mussulo é o destino de praia mais icônico de Luanda, famoso pelo seu ambiente relaxante e frutos do mar frescos.",
    category: Type.beach,
    location: "Luanda, Angola",
    status: Type__1.approved,
    photos: [],
    platformFee: BigInt(0),
    feeStatus: FeeStatus.paid,
    isPrivate: false,
  },
  {
    id: "spot-3",
    name: "M'banza Kongo",
    description:
      "Antiga capital do Reino do Kongo, classificada como Patrimônio Mundial da UNESCO. Esta cidade histórica guarda vestígios da civilização Kongo pré-colonial e é um local de enorme importância cultural e arqueológica.",
    category: Type.historical,
    location: "Zaire, Angola",
    status: Type__1.approved,
    photos: [],
    platformFee: BigInt(0),
    feeStatus: FeeStatus.paid,
    isPrivate: false,
  },
  {
    id: "spot-4",
    name: "Parque Nacional da Kissama",
    description:
      "O maior e mais antigo parque nacional de Angola, situado a sul de Luanda. Abriga diversas espécies de fauna africana como elefantes, girafas, zebras e antílopes, num ambiente de savana tropical deslumbrante.",
    category: Type.nature,
    location: "Bengo, Angola",
    status: Type__1.approved,
    photos: [],
    platformFee: BigInt(0),
    feeStatus: FeeStatus.paid,
    isPrivate: false,
  },
];

export const SPOT_IMAGES: Record<string, string> = {
  "spot-1": "/assets/generated/spot-kalandula.dim_600x400.jpg",
  "spot-2": "/assets/generated/spot-mussulo.dim_600x400.jpg",
  "spot-3": "/assets/generated/spot-mbanza.dim_600x400.jpg",
  "spot-4": "/assets/generated/spot-kissama.dim_600x400.jpg",
};

export const MOCK_GUIDES: TourGuide[] = [
  {
    id: "guide-1",
    name: "Ana Silva",
    bio: "Especialista em vida selvagem com mais de 10 anos de experiência nos parques nacionais de Angola. Apaixonada pela natureza e biodiversidade angolana.",
    languages: ["Português", "English", "Français"],
    available: true,
    pricePerDay: BigInt(150),
    status: Type__1.approved,
    platformFee: BigInt(15000),
    feeStatus: FeeStatus.paid,
  },
  {
    id: "guide-2",
    name: "Carlos Mbunda",
    bio: "Historiador formado e guia turístico certificado, especializado em sítios históricos e patrimônio cultural de Angola. Conhecimento profundo da história do Reino do Kongo.",
    languages: ["Português", "English"],
    available: true,
    pricePerDay: BigInt(120),
    status: Type__1.approved,
    platformFee: BigInt(15000),
    feeStatus: FeeStatus.paid,
  },
  {
    id: "guide-3",
    name: "Sofia Monteiro",
    bio: "Guia cultural com foco em experiências autênticas angolanas, gastronomia local, artesanato e tradições. Especializada em turismo cultural e experiências imersivas.",
    languages: ["Português", "Français"],
    available: true,
    pricePerDay: BigInt(100),
    status: Type__1.approved,
    platformFee: BigInt(15000),
    feeStatus: FeeStatus.paid,
  },
];

export const GUIDE_IMAGES: Record<string, string> = {
  "guide-1": "/assets/generated/guide-ana.dim_400x400.jpg",
  "guide-2": "/assets/generated/guide-carlos.dim_400x400.jpg",
  "guide-3": "/assets/generated/guide-sofia.dim_400x400.jpg",
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    targetId: "spot-1",
    targetType: Variant_spot_guide.spot,
    rating: BigInt(5),
    comment:
      "Lugar absolutamente deslumbrante! A queda d'água é impressionante. Uma visita obrigatória em Angola.",
    authorName: "Miguel Santos",
    userId: "user-1" as any,
  },
  {
    id: "rev-2",
    targetId: "spot-1",
    targetType: Variant_spot_guide.spot,
    rating: BigInt(4),
    comment:
      "Experiência incrível. Vale cada quilômetro de viagem. Recomendo ir cedo pela manhã para evitar multidões.",
    authorName: "Laura Ferreira",
    userId: "user-2" as any,
  },
  {
    id: "rev-3",
    targetId: "spot-2",
    targetType: Variant_spot_guide.spot,
    rating: BigInt(5),
    comment:
      "Praia paradisíaca! Águas limpas e areia fina. Os frutos do mar são deliciosos!",
    authorName: "Pedro Alves",
    userId: "user-3" as any,
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "book-1",
    guideId: "guide-1",
    spotId: "spot-4",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    message:
      "Quero explorar o parque com foco em elefantes e fotografar a vida selvagem.",
    status: BookingStatus.confirmed,
    createdAt: BigInt(Date.now()),
    userId: "user-demo" as any,
  },
];
