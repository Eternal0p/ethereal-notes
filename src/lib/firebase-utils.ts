import {
    collection,
    doc,
    getDoc,
    getDocs,
    writeBatch,
    query,
    where,
    arrayUnion,
    arrayRemove,
    runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import type { Note } from './types';

/**
 * Update bidirectional links between notes
 * @param userId - User ID
 * @param noteId - The note being edited
 * @param newLinkedTo - Array of note IDs this note now links to
 */
export async function updateLinkedNotes(
    userId: string,
    noteId: string,
    newLinkedTo: string[]
): Promise<void> {
    const noteRef = doc(db, `users/${userId}/notes`, noteId);

    await runTransaction(db, async (transaction) => {
        const noteDoc = await transaction.get(noteRef);
        const oldLinkedTo = (noteDoc.data()?.linkedTo as string[]) || [];

        // Update the source note's linkedTo array
        transaction.update(noteRef, { linkedTo: newLinkedTo });

        // Find notes to add backlinks to (newly linked)
        const toAdd = newLinkedTo.filter(id => !oldLinkedTo.includes(id));

        // Find notes to remove backlinks from (unlinked)
        const toRemove = oldLinkedTo.filter(id => !newLinkedTo.includes(id));

        // Add backlinks to newly linked notes
        for (const targetId of toAdd) {
            const targetRef = doc(db, `users/${userId}/notes`, targetId);
            const targetDoc = await transaction.get(targetRef);

            if (targetDoc.exists()) {
                const linkedFrom = (targetDoc.data()?.linkedFrom as string[]) || [];
                if (!linkedFrom.includes(noteId)) {
                    transaction.update(targetRef, {
                        linkedFrom: arrayUnion(noteId)
                    });
                }
            }
        }

        // Remove backlinks from unlinked notes
        for (const targetId of toRemove) {
            const targetRef = doc(db, `users/${userId}/notes`, targetId);
            const targetDoc = await transaction.get(targetRef);

            if (targetDoc.exists()) {
                transaction.update(targetRef, {
                    linkedFrom: arrayRemove(noteId)
                });
            }
        }
    });
}

/**
 * Get all notes that link to this note (backlinks)
 * @param userId - User ID
 * @param noteId - The note to get backlinks for
 * @returns Array of notes that link to this note
 */
export async function getBacklinks(
    userId: string,
    noteId: string
): Promise<Note[]> {
    const noteRef = doc(db, `users/${userId}/notes`, noteId);
    const noteDoc = await getDoc(noteRef);

    if (!noteDoc.exists()) return [];

    const linkedFrom = (noteDoc.data()?.linkedFrom as string[]) || [];

    if (linkedFrom.length === 0) return [];

    // Fetch all backlinked notes
    const backlinks: Note[] = [];
    for (const backlinkId of linkedFrom) {
        const backlinkRef = doc(db, `users/${userId}/notes`, backlinkId);
        const backlinkDoc = await getDoc(backlinkRef);

        if (backlinkDoc.exists() && !backlinkDoc.data()?.isDeleted) {
            backlinks.push({
                id: backlinkDoc.id,
                ...backlinkDoc.data()
            } as Note);
        }
    }

    return backlinks;
}

/**
 * Parse wiki-links from HTML content
 * Looks for patterns like [[Note Title]] or [[note-id]]
 * @param contentHtml - HTML content to parse
 * @param allNotes - All available notes to match against
 * @returns Array of note IDs that are linked
 */
export function parseWikiLinks(
    contentHtml: string,
    allNotes: Note[]
): string[] {
    const wikiLinkRegex = /\[\[(.*?)\]\]/g;
    const matches = [...contentHtml.matchAll(wikiLinkRegex)];

    const linkedIds: string[] = [];

    for (const match of matches) {
        const linkText = match[1];

        // Try to find note by ID first
        let targetNote = allNotes.find(n => n.id === linkText);

        // If not found by ID, try to find by title (case-insensitive)
        if (!targetNote) {
            targetNote = allNotes.find(
                n => n.title.toLowerCase() === linkText.toLowerCase()
            );
        }

        if (targetNote && !linkedIds.includes(targetNote.id)) {
            linkedIds.push(targetNote.id);
        }
    }

    return linkedIds;
}

/**
 * Get link context - the sentence or paragraph containing the link
 * @param contentHtml - HTML content
 * @param noteTitle - Title of the linked note
 * @returns Context string
 */
export function getLinkContext(contentHtml: string, noteTitle: string): string {
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
    const text = stripHtml(contentHtml);

    // Find the position of the note title reference
    const linkPattern = new RegExp(`\\[\\[${noteTitle}\\]\\]`, 'i');
    const match = text.match(linkPattern);

    if (!match) return '';

    const index = match.index || 0;

    // Extract surrounding context (approx 100 chars before and after)
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + noteTitle.length + 50);

    let context = text.substring(start, end);

    // Add ellipsis if trimmed
    if (start > 0) context = '...' + context;
    if (end < text.length) context = context + '...';

    return context;
}
