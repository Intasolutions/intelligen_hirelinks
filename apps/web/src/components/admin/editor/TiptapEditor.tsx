'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Heading2, Heading3 } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] max-w-none p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleBold = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); };
  const toggleItalic = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); };
  const toggleH2 = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); };
  const toggleH3 = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); };
  const toggleBulletList = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); };
  const toggleOrderedList = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); };
  const toggleBlockquote = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); };
  const undo = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().undo().run(); };
  const redo = (e: React.MouseEvent) => { e.preventDefault(); editor.chain().focus().redo().run(); };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-gray-50 border-b border-gray-200 p-2">
        <button
          onClick={toggleBold}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={toggleItalic}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          onClick={toggleH2}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={toggleH3}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          onClick={toggleBulletList}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={toggleOrderedList}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={toggleBlockquote}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          onClick={undo}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="editor-content-wrapper">
        <EditorContent editor={editor} />
      </div>
      
      {/* Tailwind Typography Styles for EditorContent area */}
      <style dangerouslySetInnerHTML={{__html: `
        .editor-content-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .editor-content-wrapper .ProseMirror h1, 
        .editor-content-wrapper .ProseMirror h2, 
        .editor-content-wrapper .ProseMirror h3 { margin-top: 1em; margin-bottom: 0.5em; font-weight: 600; }
        .editor-content-wrapper .ProseMirror h2 { font-size: 1.5em; }
        .editor-content-wrapper .ProseMirror h3 { font-size: 1.25em; }
        .editor-content-wrapper .ProseMirror p { margin-bottom: 1em; }
        .editor-content-wrapper .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .editor-content-wrapper .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .editor-content-wrapper .ProseMirror blockquote { border-left: 3px solid #e5e7eb; padding-left: 1rem; font-style: italic; color: #4b5563; }
      `}} />
    </div>
  );
};
