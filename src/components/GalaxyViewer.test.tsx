import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GalaxyViewer from './GalaxyViewer';
import { useToast } from '@/hooks/use-toast';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

// Mock hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

// Mock KnowledgeStar component
vi.mock('./KnowledgeStar', () => ({
  default: vi.fn(({ id, title }) => (
    <div data-testid={`mocked-star-${id}`}>Mocked Star: {title}</div>
  )),
}));

// Mock useIsMobile as it's used by KnowledgeStar (even if KnowledgeStar is mocked, its props might be evaluated)
// and also potentially by GalaxyViewer indirectly if it had mobile-specific logic.
vi.mock('@/hooks/use-mobile', () => ({
    __esModule: true,
    useIsMobile: vi.fn(() => false),
}));


describe('GalaxyViewer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // useIsMobile is already mocked to return false by default via the factory
  });

  it('renders the GalaxyViewer and initial stars', () => {
    render(<GalaxyViewer />);
    // Check for some of the initial stars by their mocked titles
    expect(screen.getByText(/Mocked Star: Supernova Remnants/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked Star: Black Hole at M87/i)).toBeInTheDocument();
  });

  it('renders zoom and reset buttons', () => {
    render(<GalaxyViewer />);
    expect(screen.getByRole('button', { name: /Zoom In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Zoom Out/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset View/i })).toBeInTheDocument();
  });

  it('zoom buttons and reset button are clickable and do not break the component', async () => {
    render(<GalaxyViewer />);
    const user = userEvent.setup();

    const zoomInButton = screen.getByRole('button', { name: /Zoom In/i });
    const zoomOutButton = screen.getByRole('button', { name: /Zoom Out/i });
    const resetButton = screen.getByRole('button', { name: /Reset View/i });

    // Click zoom in
    await user.click(zoomInButton);
    // Check if stars are still there (basic stability check)
    expect(screen.getByText(/Mocked Star: Supernova Remnants/i)).toBeInTheDocument();

    // Click zoom out
    await user.click(zoomOutButton);
    expect(screen.getByText(/Mocked Star: Supernova Remnants/i)).toBeInTheDocument();
    
    // Click reset
    await user.click(resetButton);
    expect(screen.getByText(/Mocked Star: Supernova Remnants/i)).toBeInTheDocument();

    // This test primarily ensures that clicking the buttons doesn't cause crashes
    // and the main content (mocked stars) remains.
    // Directly testing scale/position state changes would require more complex setup
    // or exposing state/setters, which is not the current focus.
  });

  // Test mouse drag functionality (basic check for no errors)
  it('allows mouse dragging for panning without errors', async () => {
    render(<GalaxyViewer />);
    const user = userEvent.setup();
    
    // The GalaxyViewer div itself is the drag target
    const galaxyContainer = screen.getByText(/Mocked Star: Supernova Remnants/i).closest('div[class*="bg-cosmic-dark-blue"]'); // Find the main container
    
    if (!galaxyContainer) {
      throw new Error("Galaxy container not found for drag test");
    }

    await user.pointer([
        {keys: '[MouseLeft>]', target: galaxyContainer},
        {coords: {x: 10, y: 10}},
        {keys: '[/MouseLeft]', target: galaxyContainer}
    ]);

    // Check if stars are still there (basic stability check)
    expect(screen.getByText(/Mocked Star: Supernova Remnants/i)).toBeInTheDocument();
  });

});
