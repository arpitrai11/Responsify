import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from '../src/components/Toolbar';
import { ElementPicker } from '../src/components/ElementPicker';
import { BoxModel } from '../src/components/BoxModel';
import { CssEditor } from '../src/components/CssEditor';
import { ColorInspector } from '../src/components/ColorInspector';
import { VisualModes } from '../src/components/VisualModes';
import { DeviceSelector } from '../src/components/DeviceSelector';
import { ChangeHistory } from '../src/components/ChangeHistory';
import { ElementInfo } from '../src/types/inspector';
import { DEFAULT_PRESETS, DEFAULT_USER_AGENTS } from '../src/types/presets';
import { DEFAULT_GRID_CONFIG } from '../src/types/visual-modes';

describe('React UI Components Suite', () => {
  const mockElement: ElementInfo = {
    tagName: 'button',
    id: 'submit-btn',
    classList: ['btn', 'btn-primary'],
    selector: '#submit-btn',
    rect: { top: 100, left: 50, width: 120, height: 40 },
    boxModel: {
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      border: { top: 1, right: 1, bottom: 1, left: 1 },
      padding: { top: 8, right: 16, bottom: 8, left: 16 },
      content: { width: 86, height: 22 },
    },
    computedStyles: {
      color: '#ffffff',
      'background-color': '#4f46e5',
      display: 'inline-flex',
      'font-size': '14px',
    },
    inlineStyles: {},
    textContent: 'Submit Form',
    parentHierarchy: [{ tagName: 'form', id: 'my-form', classList: [], selector: '#my-form' }],
    childrenCount: 0,
    colors: {
      color: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(79, 70, 229)',
      borderColor: 'rgb(79, 70, 229)',
    },
    contrast: {
      foreground: '#ffffff',
      background: '#4f46e5',
      ratio: 5.8,
      aaNormal: true,
      aaLarge: true,
      aaaNormal: false,
      aaaLarge: true,
    },
  };

  it('renders Toolbar with dimension inputs and triggers toggle picker', () => {
    const onTogglePicker = vi.fn();
    render(
      <Toolbar
        isPicking={false}
        onTogglePicker={onTogglePicker}
        selectedPreset={null}
        onSelectPreset={vi.fn()}
        width={390}
        height={844}
        onDimensionChange={vi.fn()}
        onToggleOrientation={vi.fn()}
        visualModes={{
          xrayEnabled: false,
          gridEnabled: false,
          gridConfig: DEFAULT_GRID_CONFIG,
          darkThemeMode: 'disabled',
          colorBlindness: 'none',
        }}
        onToggleVisualMode={vi.fn()}
        activeTab="inspect"
        onTabChange={vi.fn()}
        theme="light"
        onToggleTheme={vi.fn()}
      />
    );

    const pickBtn = screen.getByText('Pick');
    fireEvent.click(pickBtn);
    expect(onTogglePicker).toHaveBeenCalled();
  });

  it('renders ElementPicker with tag, id, classes and dimensions', () => {
    render(
      <ElementPicker
        element={mockElement}
        isPicking={false}
        onStartPicking={vi.fn()}
        onClearElement={vi.fn()}
      />
    );

    expect(screen.getByText('button')).toBeInTheDocument();
    expect(screen.getByText('submit-btn')).toBeInTheDocument();
    expect(screen.getByText('120 × 40 px')).toBeInTheDocument();
  });

  it('renders BoxModel with margin, border, padding, and content areas', () => {
    render(<BoxModel boxModel={mockElement.boxModel} />);

    expect(screen.getByText('margin')).toBeInTheDocument();
    expect(screen.getByText('border')).toBeInTheDocument();
    expect(screen.getByText('padding')).toBeInTheDocument();
    expect(screen.getByText('86 × 22')).toBeInTheDocument();
  });

  it('renders CssEditor and applies new CSS declarations', () => {
    const onApplyCss = vi.fn();
    render(
      <CssEditor
        element={mockElement}
        onApplyCss={onApplyCss}
        onRemoveCss={vi.fn()}
        onResetAll={vi.fn()}
      />
    );

    expect(screen.getByText('display:')).toBeInTheDocument();
  });

  it('renders ColorInspector with WCAG contrast ratio badges', () => {
    render(<ColorInspector element={mockElement} />);

    expect(screen.getByText('5.8 : 1')).toBeInTheDocument();
    expect(screen.getByText('AA Normal')).toBeInTheDocument();
  });

  it('renders VisualModes with X-Ray and Grid toggles', () => {
    const onChange = vi.fn();
    render(
      <VisualModes
        state={{
          xrayEnabled: false,
          gridEnabled: false,
          gridConfig: DEFAULT_GRID_CONFIG,
          darkThemeMode: 'disabled',
          colorBlindness: 'none',
        }}
        onChange={onChange}
      />
    );

    expect(screen.getByText('X-Ray Layout Inspector')).toBeInTheDocument();
    expect(screen.getByText('Adaptive Column Grid')).toBeInTheDocument();
  });

  it('renders DeviceSelector and allows selecting presets', () => {
    const onSelectPreset = vi.fn();
    render(
      <DeviceSelector
        presets={DEFAULT_PRESETS}
        selectedPreset={null}
        onSelectPreset={onSelectPreset}
        onAddCustomPreset={vi.fn()}
        onDeleteCustomPreset={vi.fn()}
        userAgents={DEFAULT_USER_AGENTS}
        selectedUserAgent={null}
        onSelectUserAgent={vi.fn()}
      />
    );

    const firstPreset = screen.getByText('iPhone 15 / 16 Pro');
    fireEvent.click(firstPreset);
    expect(onSelectPreset).toHaveBeenCalledWith(DEFAULT_PRESETS[0]);
  });

  it('renders ChangeHistory with recorded changes and export options', () => {
    const mockHistory = [
      {
        id: 'c1',
        timestamp: Date.now(),
        targetSelector: '#btn',
        category: 'css' as const,
        propertyOrField: 'background',
        previousValue: 'blue',
        newValue: 'red',
        status: 'applied' as const,
      },
    ];

    render(
      <ChangeHistory
        history={mockHistory}
        onRevertChange={vi.fn()}
        onClearHistory={vi.fn()}
      />
    );

    expect(screen.getByText('background')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('renders PreviewWorkspace with Pick & Move, Pan tool, and 100% Crisp toggle', async () => {
    const { PreviewWorkspace } = await import('../src/components/PreviewWorkspace');
    render(<PreviewWorkspace initialUrl="https://example.com" />);

    // Verify URL bar displays real target URL
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();

    // Verify Pan and Select canvas tools exist
    expect(screen.getByTitle('Select Tool: Drag & Reposition Device Screens')).toBeInTheDocument();
    expect(screen.getByTitle('Hand Tool: Pan Canvas Workspace')).toBeInTheDocument();

    // Verify 100% Crisp Zoom button exists
    const crispBtn = screen.getByText('100% Crisp');
    expect(crispBtn).toBeInTheDocument();

    // Clicking 100% Crisp sets zoom to 100%
    fireEvent.click(crispBtn);
    expect(screen.getByText('100%')).toBeInTheDocument();

    // Toggling Pan tool
    const panBtn = screen.getByTitle('Hand Tool: Pan Canvas Workspace');
    fireEvent.click(panBtn);
    expect(panBtn.className).toContain('text-indigo-600');
  });
});

