import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trackEvent, getTrackedEvents } from '../lib/analytics'

describe('Analytics Utility', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    window.sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('should track an event to sessionStorage', () => {
    trackEvent('audit_form_started')
    
    const events = getTrackedEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('audit_form_started')
    expect(events[0].timestamp).toBeDefined()
  })

  it('should include properties in tracked events', () => {
    const props = { teamSize: 20, toolCount: 5 }
    trackEvent('audit_submitted', props)
    
    const events = getTrackedEvents()
    expect(events).toHaveLength(1)
    expect(events[0].properties).toEqual(props)
  })

  it('should cap events at 50 in sessionStorage', () => {
    // Track 60 events
    for (let i = 0; i < 60; i++) {
      trackEvent('page_viewed', { index: i })
    }
    
    const events = getTrackedEvents()
    expect(events).toHaveLength(50)
    // Should contain the last 50 events
    expect(events[0].properties?.index).toBe(10)
    expect(events[49].properties?.index).toBe(59)
  })

  it('should not throw on server-side (window undefined)', () => {
    const originalWindow = global.window
    // @ts-expect-error - testing server-side environment where window is undefined
    delete (global as unknown as { window?: unknown }).window
    
    expect(() => trackEvent('page_viewed')).not.toThrow()
    
    global.window = originalWindow
  })
})
