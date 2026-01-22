import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export type Tag = {
    name: string;
    count: number;
    color?: string;
    lastUsed?: Date;
};

type TagsState = {
    tags: Map<string, Tag>;
    isLoading: boolean;

    loadTags: () => Promise<void>;
    addTag: (tagName: string) => Promise<void>;
    updateTagColor: (tagName: string, color: string) => Promise<void>;
    renameTag: (oldName: string, newName: string) => Promise<void>;
    deleteTag: (tagName: string) => Promise<void>;
    incrementTagCount: (tagName: string) => Promise<void>;
    decrementTagCount: (tagName: string) => Promise<void>;
};

export const useTagsStore = create<TagsState>()(
    persist(
        (set, get) => ({
            tags: new Map(),
            isLoading: false,

            loadTags: async () => {
                const user = auth.currentUser;
                if (!user) return;

                set({ isLoading: true });
                try {
                    const tagsRef = collection(db, `users/${user.uid}/tags`);
                    const snapshot = await getDocs(tagsRef);

                    const tagsMap = new Map<string, Tag>();
                    snapshot.docs.forEach(doc => {
                        const data = doc.data();
                        tagsMap.set(doc.id, {
                            name: doc.id,
                            count: data.count || 0,
                            color: data.color,
                            lastUsed: data.lastUsed?.toDate()
                        });
                    });

                    set({ tags: tagsMap });
                } catch (error) {
                    console.error('Error loading tags:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            addTag: async (tagName: string) => {
                const user = auth.currentUser;
                if (!user) return;

                const tagRef = doc(db, `users/${user.uid}/tags`, tagName);
                const existing = await getDoc(tagRef);

                if (!existing.exists()) {
                    await setDoc(tagRef, {
                        count: 1,
                        lastUsed: serverTimestamp()
                    });

                    const tagsMap = new Map(get().tags);
                    tagsMap.set(tagName, {
                        name: tagName,
                        count: 1,
                        lastUsed: new Date()
                    });
                    set({ tags: tagsMap });
                }
            },

            updateTagColor: async (tagName: string, color: string) => {
                const user = auth.currentUser;
                if (!user) return;

                const tagRef = doc(db, `users/${user.uid}/tags`, tagName);
                await updateDoc(tagRef, { color });

                const tagsMap = new Map(get().tags);
                const tag = tagsMap.get(tagName);
                if (tag) {
                    tagsMap.set(tagName, { ...tag, color });
                    set({ tags: tagsMap });
                }
            },

            renameTag: async (oldName: string, newName: string) => {
                const user = auth.currentUser;
                if (!user) return;

                // Update tag document
                const oldRef = doc(db, `users/${user.uid}/tags`, oldName);
                const newRef = doc(db, `users/${user.uid}/tags`, newName);

                const oldDoc = await getDoc(oldRef);
                if (oldDoc.exists()) {
                    await setDoc(newRef, oldDoc.data());
                    await updateDoc(oldRef, { count: 0 }); // Mark as deleted
                }

                // Update all notes with this tag (batch write)
                const notesRef = collection(db, `users/${user.uid}/notes`);
                const notesSnapshot = await getDocs(notesRef);

                const batch = writeBatch(db);
                let updateCount = 0;

                notesSnapshot.docs.forEach(noteDoc => {
                    const tags = noteDoc.data().tags as string[] || [];
                    if (tags.includes(oldName)) {
                        const newTags = tags.map(t => t === oldName ? newName : t);
                        batch.update(noteDoc.ref, { tags: newTags });
                        updateCount++;
                    }
                });

                if (updateCount > 0) {
                    await batch.commit();
                }

                // Update store
                const tagsMap = new Map(get().tags);
                const tag = tagsMap.get(oldName);
                if (tag) {
                    tagsMap.delete(oldName);
                    tagsMap.set(newName, { ...tag, name: newName });
                    set({ tags: tagsMap });
                }
            },

            deleteTag: async (tagName: string) => {
                const user = auth.currentUser;
                if (!user) return;

                const tagRef = doc(db, `users/${user.uid}/tags`, tagName);
                await updateDoc(tagRef, { count: 0 });

                const tagsMap = new Map(get().tags);
                tagsMap.delete(tagName);
                set({ tags: tagsMap });
            },

            incrementTagCount: async (tagName: string) => {
                const user = auth.currentUser;
                if (!user) return;

                const tagRef = doc(db, `users/${user.uid}/tags`, tagName);
                const tagDoc = await getDoc(tagRef);

                const currentCount = tagDoc.exists() ? (tagDoc.data().count || 0) : 0;
                await updateDoc(tagRef, {
                    count: currentCount + 1,
                    lastUsed: serverTimestamp()
                });

                const tagsMap = new Map(get().tags);
                const tag = tagsMap.get(tagName);
                if (tag) {
                    tagsMap.set(tagName, { ...tag, count: tag.count + 1, lastUsed: new Date() });
                    set({ tags: tagsMap });
                }
            },

            decrementTagCount: async (tagName: string) => {
                const user = auth.currentUser;
                if (!user) return;

                const tagRef = doc(db, `users/${user.uid}/tags`, tagName);
                const tagDoc = await getDoc(tagRef);

                const currentCount = tagDoc.exists() ? (tagDoc.data().count || 0) : 0;
                const newCount = Math.max(0, currentCount - 1);

                await updateDoc(tagRef, { count: newCount });

                const tagsMap = new Map(get().tags);
                const tag = tagsMap.get(tagName);
                if (tag) {
                    if (newCount === 0) {
                        tagsMap.delete(tagName);
                    } else {
                        tagsMap.set(tagName, { ...tag, count: newCount });
                    }
                    set({ tags: tagsMap });
                }
            },
        }),
        {
            name: 'tags-storage',
        }
    )
);
