import type { Timestamp, FieldValue } from 'firebase/firestore';

export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  color?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  isDeleted?: boolean;
  colSpan?: number;
  rowSpan?: number;
};
