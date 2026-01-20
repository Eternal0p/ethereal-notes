import type { Timestamp } from 'firebase/firestore';

export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  color?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted?: boolean;
  colSpan?: number;
  rowSpan?: number;
};
