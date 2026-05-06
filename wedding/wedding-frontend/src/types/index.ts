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
