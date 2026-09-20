import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import BaseMultiplicationScreen from '../BaseMultiplicationScreen';

jest.mock('../../services/soundService', () => ({
  playSound: jest.fn(),
  setMuted: jest.fn(),
  isMuted: () => false,
  default: { playSound: jest.fn(), setMuted: jest.fn(), isMuted: () => false },
}));

const renderScreen = (params: Record<string, number> = {}) =>
  render(
    <BaseMultiplicationScreen
      // Navigation props are unused by the screen beyond route params.
      navigation={{} as never}
      route={{ key: 'k', name: 'BaseMultiplication', params } as never}
    />
  );

const tapNext = () => act(() => fireEvent.press(screen.getByTestId('bm-next')));

describe('BaseMultiplicationScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders both number characters on entry', () => {
    renderScreen();
    expect(screen.getByLabelText('Number 98')).toBeTruthy();
    expect(screen.getByLabelText('Number 97')).toBeTruthy();
    expect(screen.queryByTestId('bm-base')).toBeNull();
  });

  it('reveals the base and both deviation bubbles', () => {
    renderScreen();
    tapNext();
    expect(screen.getByTestId('bm-base')).toBeTruthy();
    expect(screen.getByLabelText('98 is 2 less than 100')).toBeTruthy();
    expect(screen.getByLabelText('97 is 3 less than 100')).toBeTruthy();
  });

  it('morphs the left character into the cross-add result', () => {
    renderScreen();
    tapNext();
    tapNext();
    expect(screen.getByLabelText('Number 95')).toBeTruthy();
  });

  it('shows the padded deviation product during the multiply phase', () => {
    renderScreen();
    tapNext();
    tapNext();
    tapNext();
    // Spark/confetti are decorative, so they are hidden from the accessibility tree.
    expect(screen.getByTestId('bm-spark', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByLabelText('Right part 06')).toBeTruthy();
  });

  it('shows both blocks during merge and celebrates with confetti', () => {
    renderScreen();
    for (let i = 0; i < 4; i++) tapNext();
    expect(screen.getByTestId('bm-left-block')).toBeTruthy();
    expect(screen.getByTestId('bm-right-block')).toBeTruthy();

    tapNext();
    expect(screen.getByTestId('bm-confetti', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByTestId('bm-next').props.accessibilityState.disabled).toBe(true);
  });

  it('supports a base of 1000', () => {
    renderScreen({ leftValue: 994, rightValue: 998, base: 1000 });
    tapNext();
    tapNext();
    tapNext();
    expect(screen.getByLabelText('Right part 012')).toBeTruthy();
  });

  it('replays back to the first phase', () => {
    renderScreen();
    tapNext();
    tapNext();
    act(() => fireEvent.press(screen.getByTestId('bm-replay')));
    expect(screen.getByLabelText('Number 98')).toBeTruthy();
  });
});
