import { mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapImage from '@tiptap/extension-image'
import ImageView from './components/ImageView.vue'

export interface SetImageAttrsOptions {
  src?: string
  /** The alternative text for the image. */
  alt?: string
  /** The title of the image. */
  title?: string
  /** The width of the image. */
  width?: number | string | null
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image
       */
      setImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Update an image
       */
      updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
    }
  }
}
export const Image = TiptapImage.extend({
  inline() {
    return true
  },
  group() {
    return 'inline'
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => {
          const width = element.style.width || element.getAttribute('width') || null
          if (width && width.endsWith('%')) {
            return width
          }
          return width == null ? null : parseInt(width, 10)
        },
        renderHTML: attributes => {
          return {
            width: attributes.width,
          }
        },
      },
    }
  },

  addOptions() {
    return {
      ...this.parent?.(),
      inline: true,
      upload: null,
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageView)
  },
  addCommands() {
    return {
      ...this.parent?.(),
      updateImage:
        options =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options)
        },
    }
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(
        // Always render the `height="auto"
        {
          height: 'auto',
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ]
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },
})

export default Image
