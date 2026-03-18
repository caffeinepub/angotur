import type React from "react";
import { createContext, useContext, useState } from "react";

export type Lang = "pt" | "en";

const translations = {
  pt: {
    nav: {
      home: "Início",
      spots: "Pontos Turísticos",
      guides: "Guias",
      myBookings: "Minhas Reservas",
      admin: "Administração",
      login: "Entrar",
      logout: "Sair",
      registerSpot: "Cadastrar Ponto",
      registerGuide: "Ser Guia",
    },
    home: {
      heroTitle: "Descubra Angola",
      heroSubtitle:
        "Explore os pontos turísticos mais incríveis de Angola com guias locais especializados",
      searchPlaceholder: "Buscar pontos turísticos...",
      searchBtn: "Buscar",
      featuredSpots: "Pontos Turísticos em Destaque",
      featuredGuides: "Nossos Guias",
      exploreAll: "Ver Todos",
      bookGuide: "Reservar Guia",
    },
    spots: {
      title: "Pontos Turísticos",
      all: "Todos",
      nature: "Natureza",
      beach: "Praia",
      historical: "Histórico",
      museum: "Museu",
      city: "Cidade",
      details: "Ver Detalhes",
      location: "Localização",
      noResults: "Nenhum ponto encontrado.",
    },
    spotDetail: {
      reviews: "Avaliações",
      addReview: "Adicionar Avaliação",
      yourName: "Seu nome",
      yourComment: "Seu comentário",
      submit: "Enviar",
      rating: "Nota",
      noReviews: "Ainda sem avaliações.",
      bookGuide: "Reservar um Guia",
    },
    guides: {
      title: "Guias Turísticos",
      perDay: "/dia",
      languages: "Idiomas",
      available: "Disponível",
      unavailable: "Indisponível",
      viewProfile: "Ver Perfil",
      noResults: "Nenhum guia encontrado.",
    },
    guideDetail: {
      bookNow: "Fazer Reserva",
      startDate: "Data de Início",
      endDate: "Data de Fim",
      message: "Mensagem",
      messagePlaceholder: "Descreva o que você precisa...",
      submit: "Confirmar Reserva",
      selectSpot: "Selecionar Ponto Turístico (opcional)",
      bookingSuccess: "Reserva realizada com sucesso!",
      loginRequired: "Faça login para reservar.",
    },
    registerSpot: {
      title: "Cadastrar Ponto Turístico",
      name: "Nome",
      description: "Descrição",
      category: "Categoria",
      location: "Localização",
      photos: "Fotos",
      submit: "Enviar para Aprovação",
      success: "Ponto enviado! Aguarde aprovação.",
    },
    registerGuide: {
      title: "Cadastrar como Guia",
      name: "Nome Completo",
      bio: "Biografia",
      languages: "Idiomas (separados por vírgula)",
      price: "Preço por Dia (USD)",
      photo: "Foto de Perfil",
      submit: "Enviar Cadastro",
      success: "Cadastro enviado! Aguarde aprovação.",
    },
    admin: {
      title: "Painel Administrativo",
      stats: "Estatísticas",
      pendingSpots: "Pontos Pendentes",
      pendingGuides: "Guias Pendentes",
      allBookings: "Todas as Reservas",
      approve: "Aprovar",
      reject: "Rejeitar",
      totalSpots: "Total de Pontos",
      totalGuides: "Total de Guias",
      totalReviews: "Total de Avaliações",
      confirmedBookings: "Reservas Confirmadas",
      pendingBookings: "Reservas Pendentes",
      cancelledBookings: "Reservas Canceladas",
    },
    bookings: {
      title: "Minhas Reservas",
      guide: "Guia",
      spot: "Ponto",
      dates: "Datas",
      status: "Status",
      message: "Mensagem",
      noBookings: "Você ainda não tem reservas.",
      pending: "Pendente",
      confirmed: "Confirmada",
      cancelled: "Cancelada",
      loginRequired: "Faça login para ver suas reservas.",
    },
    footer: {
      rights: "Todos os direitos reservados",
      builtWith: "Construído com amor usando",
    },
  },
  en: {
    nav: {
      home: "Home",
      spots: "Tourist Spots",
      guides: "Guides",
      myBookings: "My Bookings",
      admin: "Admin",
      login: "Login",
      logout: "Logout",
      registerSpot: "Register Spot",
      registerGuide: "Become a Guide",
    },
    home: {
      heroTitle: "Discover Angola",
      heroSubtitle:
        "Explore Angola's most incredible tourist spots with specialized local guides",
      searchPlaceholder: "Search tourist spots...",
      searchBtn: "Search",
      featuredSpots: "Featured Tourist Spots",
      featuredGuides: "Our Guides",
      exploreAll: "See All",
      bookGuide: "Book Guide",
    },
    spots: {
      title: "Tourist Spots",
      all: "All",
      nature: "Nature",
      beach: "Beach",
      historical: "Historical",
      museum: "Museum",
      city: "City",
      details: "View Details",
      location: "Location",
      noResults: "No spots found.",
    },
    spotDetail: {
      reviews: "Reviews",
      addReview: "Add Review",
      yourName: "Your name",
      yourComment: "Your comment",
      submit: "Submit",
      rating: "Rating",
      noReviews: "No reviews yet.",
      bookGuide: "Book a Guide",
    },
    guides: {
      title: "Tour Guides",
      perDay: "/day",
      languages: "Languages",
      available: "Available",
      unavailable: "Unavailable",
      viewProfile: "View Profile",
      noResults: "No guides found.",
    },
    guideDetail: {
      bookNow: "Book Now",
      startDate: "Start Date",
      endDate: "End Date",
      message: "Message",
      messagePlaceholder: "Describe what you need...",
      submit: "Confirm Booking",
      selectSpot: "Select Tourist Spot (optional)",
      bookingSuccess: "Booking confirmed successfully!",
      loginRequired: "Please login to make a booking.",
    },
    registerSpot: {
      title: "Register Tourist Spot",
      name: "Name",
      description: "Description",
      category: "Category",
      location: "Location",
      photos: "Photos",
      submit: "Submit for Approval",
      success: "Spot submitted! Awaiting approval.",
    },
    registerGuide: {
      title: "Register as Guide",
      name: "Full Name",
      bio: "Biography",
      languages: "Languages (comma-separated)",
      price: "Price per Day (USD)",
      photo: "Profile Photo",
      submit: "Submit Registration",
      success: "Registration submitted! Awaiting approval.",
    },
    admin: {
      title: "Admin Dashboard",
      stats: "Statistics",
      pendingSpots: "Pending Spots",
      pendingGuides: "Pending Guides",
      allBookings: "All Bookings",
      approve: "Approve",
      reject: "Reject",
      totalSpots: "Total Spots",
      totalGuides: "Total Guides",
      totalReviews: "Total Reviews",
      confirmedBookings: "Confirmed Bookings",
      pendingBookings: "Pending Bookings",
      cancelledBookings: "Cancelled Bookings",
    },
    bookings: {
      title: "My Bookings",
      guide: "Guide",
      spot: "Spot",
      dates: "Dates",
      status: "Status",
      message: "Message",
      noBookings: "You have no bookings yet.",
      pending: "Pending",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      loginRequired: "Please login to view your bookings.",
    },
    footer: {
      rights: "All rights reserved",
      builtWith: "Built with love using",
    },
  },
};

type Translations = typeof translations.pt;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({
  lang: "pt",
  setLang: () => {},
  t: translations.pt,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
