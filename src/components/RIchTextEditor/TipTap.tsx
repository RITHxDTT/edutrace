import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'
import { Link2, Unlink } from 'lucide-react'
import styles from './style.module.css'

// Define the props for the RichTextEditor
type RichTextEditorProps = {
  label?: string; // Optional label prop
  value?: string;
  onChange?: (value: string) => void;
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`${styles.toolbarBtn} ${isActive ? styles.toolbarBtnActive : ''}`}
  >
    {children}
  </button>
)

export default function RichTextEditor({ label, value = '', onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Code,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return
    editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  if (!editor) return null

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className="font-semibold text-label mb-1 transition-colors duration-150 group-focus-within:text-primary">
          {label}
        </label>
      )}

      <EditorContent editor={editor} className={styles.tiptap} />

      <div className={styles.toolbar}>
        {/* Headings */}
        <ToolbarButton
          title="Heading 1"
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="Paragraph"
          isActive={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </ToolbarButton>

        <div className={styles.divider} />

        {/* Marks */}
        <ToolbarButton
          title="Bold"
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Code"
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {'</>'}
        </ToolbarButton>

        <div className={styles.divider} />

        {/* Lists */}
        <ToolbarButton
          title="Bullet list"
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • —
        </ToolbarButton>
        <ToolbarButton
          title="Ordered list"
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &quot;
        </ToolbarButton>

        <div className={styles.divider} />

        {/* Link */}
        <ToolbarButton
          title="Set link"
          isActive={editor.isActive('link')}
          onClick={() => {
            const prev = editor.getAttributes('link').href ?? ''
            const url = window.prompt('Enter URL', prev || 'https://')
            if (url === null) return
            if (url === '') {
              editor.chain().focus().unsetLink().run()
            } else {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
        >
          <Link2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Remove link"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink size={14} />
        </ToolbarButton>
      </div>
    </div>
  )
}
