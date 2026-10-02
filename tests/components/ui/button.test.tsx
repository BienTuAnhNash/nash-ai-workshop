import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { Button } from '../../../src/components/ui/button'

describe('Button', () => {
  it('renders as a native button with default attributes', () => {
    render(<Button>Submit</Button>)

    const button = screen.getByRole('button', { name: 'Submit' })

    expect(button.tagName).toBe('BUTTON')
    expect(button.getAttribute('data-slot')).toBe('button')
    expect(button.getAttribute('data-variant')).toBe('default')
    expect(button.getAttribute('data-size')).toBe('default')
  })

  it('applies variant, size, and custom className', () => {
    render(
      <Button variant="destructive" size="lg" className="custom-class">
        Delete
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Delete' })

    expect(button.getAttribute('data-variant')).toBe('destructive')
    expect(button.getAttribute('data-size')).toBe('lg')
    expect(button.className).toContain('custom-class')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Click me' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('forwards disabled state to native button', () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Disabled' })
    fireEvent.click(button)

    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/settings">Go settings</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Go settings' })

    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/settings')
    expect(link.getAttribute('data-slot')).toBe('button')
  })
})
