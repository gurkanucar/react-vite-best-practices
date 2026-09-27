import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { isRichTextEmpty, RichTextEditor, richTextToPlain } from '@/components/RichTextEditor'

describe('richTextToPlain', () => {
  it('reads the words, with a space where a block ends', () => {
    expect(richTextToPlain('<h3>Plan</h3><ul><li>One</li><li><b>Two</b></li></ul>')).toBe(
      'Plan One Two',
    )
  })

  it('treats markup with no words as empty', () => {
    expect(isRichTextEmpty('<p><br></p>')).toBe(true)
    expect(isRichTextEmpty(undefined)).toBe(true)
    expect(isRichTextEmpty('<p>x</p>')).toBe(false)
  })
})

describe('RichTextEditor', () => {
  it('shows its value, reports edits, and follows a value set from outside', () => {
    const onChange = vi.fn<(html: string) => void>()

    function Harness() {
      const [value, setValue] = useState('<p>Hello</p>')
      return (
        <>
          <RichTextEditor
            value={value}
            placeholder="Notes"
            onChange={(html) => {
              onChange(html)
              setValue(html)
            }}
          />
          <button type="button" onClick={() => setValue('')}>
            Reset
          </button>
        </>
      )
    }

    render(<Harness />)
    const surface = screen.getByRole('textbox', { name: 'Notes' })
    expect(surface).toHaveTextContent('Hello')

    surface.innerHTML = '<p>Hello <b>world</b></p>'
    fireEvent.input(surface)
    expect(onChange).toHaveBeenLastCalledWith('<p>Hello <b>world</b></p>')

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(surface).toBeEmptyDOMElement()
  })

  it('can leave out the heading picker', () => {
    render(<RichTextEditor placeholder="Notes" headings={false} />)

    expect(screen.queryByRole('combobox', { name: 'Text style' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
  })
})
