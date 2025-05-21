import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KnowledgeStar from './KnowledgeStar';
import { KnowledgeStarProvider, useKnowledgeStar } from '@/context/KnowledgeStarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock hooks
vi.mock('@/hooks/use-is-mobile', () => ({
  __esModule: true,
  useIsMobile: vi.fn(() => false),
}));
vi.mock('@/hooks/use-toast', () => ({
  __esModule: true,
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

// Mock context
// We need to provide a more flexible mock for useKnowledgeStar
// that can be updated by tests.
let mockActiveStarId: string | null = null;
const mockSetActiveStarId = vi.fn((id) => {
  mockActiveStarId = id;
});

vi.mock('@/context/KnowledgeStarContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/KnowledgeStarContext')>();
  return {
    ...actual,
    useKnowledgeStar: () => ({
      activeStarId: mockActiveStarId,
      setActiveStarId: mockSetActiveStarId,
    }),
  };
});


const defaultProps = {
  id: 'star1',
  size: 20,
  position: { top: '10%', left: '10%' },
  color: 'yellow' as const,
  title: 'Test Star Title',
  content: 'Test star content here.',
  onUpdate: vi.fn(),
};

// Helper function to render with provider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <KnowledgeStarProvider> 
      {ui}
    </KnowledgeStarProvider>
  );
};


describe('KnowledgeStar Component', () => {
  beforeEach(() => {
    // Reset mocks and mock state before each test
    vi.clearAllMocks();
    mockActiveStarId = null; // Explicitly reset mock state
    // useIsMobile is already mocked to return false by default via the factory
    // If a specific test needs a different value, it can be set like:
    // import { useIsMobile as useIsMobileActual } from '@/hooks/use-is-mobile';
    // vi.mocked(useIsMobileActual).mockReturnValueOnce(true);
  });

  it('renders the star', () => {
    renderWithProvider(<KnowledgeStar {...defaultProps} />);
    // The star itself doesn't have text, it's identified by its presence and props.
    // We can check if an element with the star's ID is rendered.
    // However, RTL philosophy is to query like a user. A user sees a star.
    // Let's assume the star has a role or test ID if needed, but for now, rendering without error is a start.
    // The component itself is a div with class 'knowledge-star'.
    const starElement = document.getElementById(defaultProps.id);
    expect(starElement).toBeInTheDocument();
  });

  it('opens its popup when clicked (sets activeStarId)', async () => {
    renderWithProvider(<KnowledgeStar {...defaultProps} />);
    const starElement = document.getElementById(defaultProps.id);
    expect(starElement).toBeInTheDocument();

    if (starElement) {
      await userEvent.click(starElement);
    }
    expect(mockSetActiveStarId).toHaveBeenCalledWith(defaultProps.id);
  });
  
  // To test popup content, we need to simulate activeStarId being this star's ID
  it('displays title and content when popup is open', () => {
    mockActiveStarId = defaultProps.id; // Simulate this star is active
    renderWithProvider(<KnowledgeStar {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
  });

  it('closes the popup when its close button is clicked', async () => {
    mockActiveStarId = defaultProps.id; // Simulate this star is active
    renderWithProvider(<KnowledgeStar {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument(); // Popup is open

    const closeButton = screen.getByRole('button', { name: /Close popup/i });
    await userEvent.click(closeButton);

    expect(mockSetActiveStarId).toHaveBeenCalledWith(null);
  });

  it('switches to editing state when "Edit" button is clicked', async () => {
    mockActiveStarId = defaultProps.id; // Simulate this star is active
    renderWithProvider(<KnowledgeStar {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument(); // Ensure popup is open

    const editButton = screen.getByRole('button', { name: /Edit star/i });
    await userEvent.click(editButton);

    // Check for input field for title (it should have the current title as value)
    const titleInput = screen.getByDisplayValue(defaultProps.title);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.tagName).toBe('INPUT');

    // Check for textarea for content
    const contentTextarea = screen.getByDisplayValue(defaultProps.content);
    expect(contentTextarea).toBeInTheDocument();
    expect(contentTextarea.tagName).toBe('TEXTAREA');

    // Save button should be visible
    expect(screen.getByRole('button', { name: /Save changes/i })).toBeInTheDocument();
  });

  it('auto-closes after 10 seconds if not editing', async () => {
    vi.useFakeTimers();
    mockActiveStarId = defaultProps.id; // Simulate this star is active
    renderWithProvider(<KnowledgeStar {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument(); // Popup is open

    // Fast-forward time by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(mockSetActiveStarId).toHaveBeenCalledWith(null);
    vi.useRealTimers();
  });

  it('does not auto-close if editing', async () => {
    vi.useFakeTimers();
    mockActiveStarId = defaultProps.id; // Simulate this star is active
    renderWithProvider(<KnowledgeStar {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();

    // Click edit button
    const editButton = screen.getByRole('button', { name: /Edit star/i });
    // Using fireEvent.click as a synchronous alternative to userEvent.click for this specific timer test
    fireEvent.click(editButton);

    // Confirm edit mode is active by checking for the save button
    expect(screen.getByRole('button', { name: /Save changes/i })).toBeInTheDocument();

    // Fast-forward time well past the 10-second auto-close duration
    vi.advanceTimersByTime(11000); 

    // setActiveStarId should NOT have been called with null for auto-close
    // It would have been called by handleEdit -> clearTimeout, but not for closing.
    // The important part is that it wasn't called with null to close the dialog.
    // mockSetActiveStarId is cleared in beforeEach. If it was called with null, it would be a new call.
    expect(mockSetActiveStarId).not.toHaveBeenCalledWith(null);

    vi.useRealTimers();
  });
});
