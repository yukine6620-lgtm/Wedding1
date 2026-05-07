// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

// Invitation
export interface InvitationDto {
  id: string;
  slug: string;
  title: string;
  templateId: string;
  jsonData: string;
  status: "Draft" | "Published" | "Paid";
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationRequest {
  templateId: string;
  title: string;
  jsonData?: string;
}

export interface UpdateInvitationRequest {
  title?: string;
  jsonData?: string;
}

// Template
export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  isPremium: boolean;
}

// Invitation JSON schema
export interface InvitationTheme {
  primaryColor: string;
  secondaryColor?: string;
  font: string;
}

export interface InvitationSection {
  id: string;
  type: "hero" | "story" | "event" | "gallery" | "rsvp";
  data: Record<string, unknown>;
}

export interface InvitationSchema {
  version: string;
  theme: InvitationTheme;
  sections: InvitationSection[];
}

// AI
export interface GenerateInvitationRequest {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  style: "romantic" | "modern" | "traditional" | "minimalist";
  additionalInfo?: string;
}

export interface GenerateInvitationResponse {
  jsonData: string;
  isAiGenerated: boolean;
  warning?: string;
}

// RSVP
export interface RsvpRequest {
  invitationId: string;
  name: string;
  phone: string;
  status: "Attending" | "NotAttending" | "Maybe";
  message?: string;
}

export interface RsvpDto {
  id: string;
  invitationId: string;
  name: string;
  phone: string;
  status: string;
  message: string;
  createdAt: string;
}

// Payment
export interface PaymentRequest {
  invitationId: string;
  returnUrl: string;
}

export interface PaymentResponse {
  payUrl: string;
  orderId: string;
}
