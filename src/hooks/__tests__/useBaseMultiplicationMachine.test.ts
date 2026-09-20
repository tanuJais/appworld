import { act, renderHook } from '@testing-library/react-native';
import useBaseMultiplicationMachine, { MachineOptions } from '../useBaseMultiplicationMachine';

const EXAMPLE = { leftValue: 98, rightValue: 97, base: 100, announce: false, autoPlayDelayMs: 100 };

describe('useBaseMultiplicationMachine', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('starts in the enter phase with the derived example state', () => {
    const { result } = renderHook(() => useBaseMultiplicationMachine(EXAMPLE));
    expect(result.current.state.phase).toBe('enter');
    expect(result.current.state.finalResult).toBe('9506');
    expect(result.current.isFinished).toBe(false);
  });

  it('advances through every phase with next()', () => {
    const { result } = renderHook(() => useBaseMultiplicationMachine(EXAMPLE));
    const seen = [result.current.state.phase];
    for (let i = 0; i < 5; i++) {
      act(() => result.current.next());
      seen.push(result.current.state.phase);
    }
    expect(seen).toEqual(['enter', 'deviations', 'crossAdd', 'multiply', 'merge', 'celebrate']);
    expect(result.current.isFinished).toBe(true);
  });

  it('clamps at the final phase', () => {
    const { result } = renderHook(() => useBaseMultiplicationMachine(EXAMPLE));
    for (let i = 0; i < 10; i++) act(() => result.current.next());
    expect(result.current.state.phase).toBe('celebrate');
  });

  it('steps backwards and stops auto-play', () => {
    const { result } = renderHook(() => useBaseMultiplicationMachine(EXAMPLE));
    act(() => result.current.toggleAutoPlay());
    act(() => result.current.next());
    act(() => result.current.back());
    expect(result.current.state.phase).toBe('enter');
    expect(result.current.isAutoPlaying).toBe(false);
  });

  it('does not auto-advance until the phase animation reports completion', () => {
    const { result } = renderHook(() => useBaseMultiplicationMachine(EXAMPLE));
    act(() => result.current.toggleAutoPlay());
    act(() => jest.advanceTimersByTime(500));
    expect(result.current.state.phase).toBe('enter');

    act(() => result.current.onPhaseAnimationComplete('enter'));
    act(() => jest.advanceTimersByTime(150));
    expect(result.current.state.phase).toBe('deviations');
  });

  it('ignores completion callbacks from a stale phase', () => {
    const { result } = renderHook(() => useBaseMultiplicationMachine(EXAMPLE));
    act(() => result.current.toggleAutoPlay());
    act(() => result.current.next()); // now on deviations
    act(() => result.current.onPhaseAnimationComplete('enter'));
    act(() => jest.advanceTimersByTime(150));
    expect(result.current.state.phase).toBe('deviations');
  });

  it('stops auto-advancing at the celebrate phase', () => {
    const { result } = renderHook(() => useBaseMultiplicationMachine(EXAMPLE));
    act(() => result.current.toggleAutoPlay());
    for (let i = 0; i < 5; i++) act(() => result.current.next());
    act(() => result.current.onPhaseAnimationComplete('celebrate'));
    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.state.phase).toBe('celebrate');
  });

  it('replays from the beginning', () => {
    const { result } = renderHook(() => useBaseMultiplicationMachine(EXAMPLE));
    for (let i = 0; i < 3; i++) act(() => result.current.next());
    act(() => result.current.replay());
    expect(result.current.state.phase).toBe('enter');
  });

  it('resets when the example changes', () => {
    const { result, rerender } = renderHook((props: MachineOptions) => useBaseMultiplicationMachine(props), {
      initialProps: EXAMPLE,
    });
    act(() => result.current.next());
    rerender({ ...EXAMPLE, leftValue: 994, rightValue: 998, base: 1000 });
    expect(result.current.state.phase).toBe('enter');
    expect(result.current.state.finalResult).toBe('992012');
  });
});
