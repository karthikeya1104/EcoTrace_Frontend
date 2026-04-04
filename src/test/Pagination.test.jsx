import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../components/Pagination'

describe('Pagination Component', () => {
  it('renders pagination controls', () => {
    const mockOnPrevious = vi.fn()
    const mockOnNext = vi.fn()

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    )

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    const mockOnPrevious = vi.fn()
    const mockOnNext = vi.fn()

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    )

    const previousButton = screen.getByRole('button', { name: /previous/i })
    expect(previousButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    const mockOnPrevious = vi.fn()
    const mockOnNext = vi.fn()

    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    )

    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('calls onPrevious when previous button is clicked', async () => {
    const mockOnPrevious = vi.fn()
    const mockOnNext = vi.fn()

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    )

    const previousButton = screen.getByRole('button', { name: /previous/i })
    await userEvent.click(previousButton)

    expect(mockOnPrevious).toHaveBeenCalledTimes(1)
    expect(mockOnNext).not.toHaveBeenCalled()
  })

  it('calls onNext when next button is clicked', async () => {
    const mockOnPrevious = vi.fn()
    const mockOnNext = vi.fn()

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    )

    const nextButton = screen.getByRole('button', { name: /next/i })
    await userEvent.click(nextButton)

    expect(mockOnNext).toHaveBeenCalledTimes(1)
    expect(mockOnPrevious).not.toHaveBeenCalled()
  })

  it('shows correct page information', () => {
    const mockOnPrevious = vi.fn()
    const mockOnNext = vi.fn()

    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    )

    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
  })

  it('handles single page correctly', () => {
    const mockOnPrevious = vi.fn()
    const mockOnNext = vi.fn()

    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    )

    const previousButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })

    expect(previousButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })

  it('applies correct CSS classes', () => {
    const mockOnPrevious = vi.fn()
    const mockOnNext = vi.fn()

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    )

    const container = screen.getByText('Page 2 of 5').closest('div')
    expect(container).toHaveClass('flex', 'items-center', 'justify-between')

    const previousButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })

    expect(previousButton).toHaveClass('px-4', 'py-2', 'bg-blue-500', 'text-white', 'rounded')
    expect(nextButton).toHaveClass('px-4', 'py-2', 'bg-blue-500', 'text-white', 'rounded')
  })
})