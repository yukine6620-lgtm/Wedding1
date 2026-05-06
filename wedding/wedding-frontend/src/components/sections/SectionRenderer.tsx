import type { InvitationSection } from "@/types";
import HeroSection from "./HeroSection";
import StorySection from "./StorySection";
import EventSection from "./EventSection";
import GallerySection from "./GallerySection";
import RsvpSection from "./RsvpSection";

interface Props {
  section: InvitationSection;
  isEditing?: boolean;
}

export default function SectionRenderer({ section, isEditing }: Props) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} isEditing={isEditing} />;
    case "story":
      return <StorySection section={section} isEditing={isEditing} />;
    case "event":
      return <EventSection section={section} isEditing={isEditing} />;
    case "gallery":
      return <GallerySection section={section} isEditing={isEditing} />;
    case "rsvp":
      return <RsvpSection section={section} isEditing={isEditing} />;
    default:
      return null;
  }
}
