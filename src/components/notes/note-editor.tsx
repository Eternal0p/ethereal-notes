'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useNotesStore } from '@/store/notes';
import type { Note } from '@/lib/types';
import { ArrowLeft, MoreVertical, Loader2, Trash2 } from 'lucide-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import EditorToolbar from '@/components/editor/editor-toolbar';
import { EditorContent } from '@tiptap/react';
import TagInput from './tag-input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  color: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

const colors = [
  { value: '#6262f3', label: 'Blue' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f97316', label: 'Orange' },
  { value: '#06b6d4', label: 'Cyan' },
];

export default function NoteEditor() {
  const { isEditorOpen, setIsEditorOpen, currentNote, setCurrentNote, isReadOnly, setIsReadOnly } = useNotesStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contentHtml, setContentHtml] = useState('');
  const { toast } = useToast();
  const user = auth.currentUser;

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      color: colors[0].value,
      tags: [],
    },
  });

  // Initialize TipTap editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content: contentHtml,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[250px] text-zinc-300 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContentHtml(html);
      // Extract plain text for content field
      const text = editor.getText();
      form.setValue('content', text);
    },
  });

  // Load note data when currentNote changes
  useEffect(() => {
    if (currentNote) {
      form.reset({
        title: currentNote.title,
        content: currentNote.content,
        color: currentNote.color || colors[0].value,
        tags: currentNote.tags || [],
      });
      const htmlContent = (currentNote as any).contentHtml || `<p>${currentNote.content}</p>`;
      setContentHtml(htmlContent);
      editor?.commands.setContent(htmlContent);
    } else {
      form.reset({
        title: '',
        content: '',
        color: colors[0].value,
        tags: [],
      });
      setContentHtml('');
      editor?.commands.setContent('');
    }
  }, [currentNote, form, isEditorOpen, editor]);

  const handleClose = () => {
    if (isSaving || isDeleting) return;
    setIsEditorOpen(false);
    setCurrentNote(null);
  };

  const getTimeSinceEdit = () => {
    if (!currentNote?.updatedAt) return '';

    const now = Date.now();
    const updated = currentNote.updatedAt instanceof Object && 'seconds' in currentNote.updatedAt
      ? currentNote.updatedAt.seconds * 1000
      : Date.now();
    const diff = now - updated;

    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'EDITED JUST NOW';
    if (minutes < 60) return `EDITED ${minutes}M AGO`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `EDITED ${hours}H AGO`;

    const days = Math.floor(hours / 24);
    return `EDITED ${days}D AGO`;
  };

  const onSubmit = async (values: z.infer<typeof noteSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not authenticated' });
      return;
    }

    setIsSaving(true);
    try {
      // Generate excerpt from plain text
      const excerpt = values.content.substring(0, 150) + (values.content.length > 150 ? '...' : '');

      const noteData = {
        ...values,
        excerpt,
        contentHtml,
        updatedAt: serverTimestamp(),
        userId: user.uid,
        isDeleted: false,
      };

      if (currentNote) {
        const noteRef = doc(db, `users/${user.uid}/notes`, currentNote.id);
        await updateDoc(noteRef, noteData);
        toast({ title: 'Note updated successfully' });
      } else {
        await addDoc(collection(db, `users/${user.uid}/notes`), {
          ...noteData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Note created successfully' });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving note: ', error);
      toast({ variant: 'destructive', title: 'Error saving note' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !currentNote) return;
    setIsDeleting(true);
    try {
      const noteRef = doc(db, `users/${user.uid}/notes`, currentNote.id);
      await updateDoc(noteRef, { isDeleted: true, updatedAt: serverTimestamp() });
      toast({ title: "Note moved to trash" });
      handleClose();
    } catch (error) {
      console.error("Error deleting note: ", error);
      toast({ variant: "destructive", title: "Error deleting note" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isEditorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <button
            onClick={handleClose}
            disabled={isSaving || isDeleting}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {currentNote && (
            <p className="text-[10px] text-zinc-600 font-mono tracking-wider">
              {getTimeSinceEdit()}
            </p>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isSaving || isDeleting}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </AlertDialogTrigger>
            {currentNote && (
              <AlertDialogContent className="glass-panel border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will move the note to trash.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
        </div>

        {/* Editor Content */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <input
            {...form.register('title')}
            placeholder="Note Title"
            className="w-full bg-transparent border-none text-3xl font-bold text-white placeholder-zinc-700 focus:outline-none"
          />

          {/* Rich Text Editor */}
          <div className="space-y-3">
            <EditorToolbar editor={editor} />
            <div className="glass-card rounded-xl p-4 min-h-[300px]">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400 font-medium">Color</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => form.setValue('color', color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${form.watch('color') === color.value
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400 font-medium">Tags</label>
            <TagInput
              tags={form.watch('tags')}
              onChange={(tags) => form.setValue('tags', tags)}
              placeholder="Add tags (press Enter)"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving || isDeleting}
            className="w-full glass-pill-button flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition-all hover:scale-[1.02] active:scale-95"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {currentNote ? 'Save Changes' : 'Create Note'}
          </button>
        </form>
      </div>
    </div>
  );
}
