import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Sidebar from '../components/Sidebar'

const mockLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/products', label: 'Products', icon: '📦' },
  { path: '/batches', label: 'Batches', icon: '📋' },
  { path: '/reports', label: 'Reports', icon: '📄' }
]

const renderSidebar = (props = {}) => {
  return render(
    <BrowserRouter>
      <Sidebar
        links={mockLinks}
        activeLink="/products"
        onLogout={vi.fn()}
        {...props}
      />
    </BrowserRouter>
  )
}

describe('Sidebar Component', () => {
  it('renders all navigation links', () => {
    renderSidebar()

    mockLinks.forEach(link => {
      expect(screen.getByText(link.label)).toBeInTheDocument()
    })
  })

  it('highlights active link', () => {
    renderSidebar()

    const activeLink = screen.getByText('Products')
    expect(activeLink.closest('a')).toHaveClass('bg-blue-100', 'text-blue-700')
  })

  it('shows non-active links with default styling', () => {
    renderSidebar()

    const dashboardLink = screen.getByText('Dashboard')
    const linkElement = dashboardLink.closest('a')
    expect(linkElement).toHaveClass('text-gray-600', 'hover:bg-gray-50')
    expect(linkElement).not.toHaveClass('bg-blue-100')
  })

  it('renders logout button', () => {
    renderSidebar()

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('calls onLogout when logout button is clicked', async () => {
    const mockOnLogout = vi.fn()
    renderSidebar({ onLogout: mockOnLogout })

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await userEvent.click(logoutButton)

    expect(mockOnLogout).toHaveBeenCalledTimes(1)
  })

  it('navigates to correct paths', () => {
    renderSidebar()

    mockLinks.forEach(link => {
      const linkElement = screen.getByText(link.label).closest('a')
      expect(linkElement).toHaveAttribute('href', link.path)
    })
  })

  it('displays icons next to labels', () => {
    renderSidebar()

    mockLinks.forEach(link => {
      const linkText = screen.getByText(link.label)
      const linkElement = linkText.closest('a')
      expect(linkElement).toHaveTextContent(link.icon)
    })
  })

  it('has correct accessibility attributes', () => {
    renderSidebar()

    const navigation = screen.getByRole('navigation')
    expect(navigation).toBeInTheDocument()

    mockLinks.forEach(link => {
      const linkElement = screen.getByText(link.label).closest('a')
      expect(linkElement).toHaveAttribute('aria-current', link.path === '/products' ? 'page' : 'false')
    })
  })

  it('applies responsive classes', () => {
    renderSidebar()

    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toHaveClass('bg-white', 'shadow-lg')

    // Check if it has responsive width classes
    expect(sidebar).toHaveClass('w-64') // Default width
  })

  it('handles empty links array', () => {
    render(
      <BrowserRouter>
        <Sidebar
          links={[]}
          activeLink="/dashboard"
          onLogout={vi.fn()}
        />
      </BrowserRouter>
    )

    // Should still render logout button
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()

    // Should not render any navigation links
    mockLinks.forEach(link => {
      expect(screen.queryByText(link.label)).not.toBeInTheDocument()
    })
  })

  it('handles missing onLogout prop', () => {
    // This should not throw an error
    expect(() => {
      render(
        <BrowserRouter>
          <Sidebar
            links={mockLinks}
            activeLink="/dashboard"
          />
        </BrowserRouter>
      )
    }).not.toThrow()
  })

  it('updates active link when activeLink prop changes', () => {
    const { rerender } = render(
      <BrowserRouter>
        <Sidebar
          links={mockLinks}
          activeLink="/dashboard"
          onLogout={vi.fn()}
        />
      </BrowserRouter>
    )

    // Initially dashboard should be active
    expect(screen.getByText('Dashboard').closest('a')).toHaveClass('bg-blue-100')

    // Rerender with different active link
    rerender(
      <BrowserRouter>
        <Sidebar
          links={mockLinks}
          activeLink="/products"
          onLogout={vi.fn()}
        />
      </BrowserRouter>
    )

    // Now products should be active
    expect(screen.getByText('Products').closest('a')).toHaveClass('bg-blue-100')
    expect(screen.getByText('Dashboard').closest('a')).not.toHaveClass('bg-blue-100')
  })
})