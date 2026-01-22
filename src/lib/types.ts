import type { Timestamp, FieldValue } from 'firebase/firestore';

export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  contentHtml?: string;    // Rich HTML content for editor
  excerpt?: string;
  tags: string[];
  color?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  isDeleted?: boolean;
  colSpan?: number;
  rowSpan?: number;

  // Module 1: Wiki-Linking (bidirectional links)
  linkedTo?: string[];      // IDs of notes this note links TO
  linkedFrom?: string[];    // IDs of notes linking here (backlinks)

  // Module 2: Client-side Intelligence
  keywords?: string[];      // Extracted keywords for better search

  // Module 4: Collaboration & Sharing
  isPublic?: boolean;       // Published to web
  publicSlug?: string;      // URL-friendly identifier (e.g., "my-cool-note")

  // Module 5: Version History
  version?: number;         // Incrementing version number
};
