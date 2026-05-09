export type AnalyticsEvent =
  | 'page_viewed'
  | 'audit_form_started'
  | 'audit_form_step_completed'
  | 'audit_submitted'
  | 'audit_viewed'
  | 'summary_generated'
  | 'summary_fallback_used'
  | 'lead_form_opened'
  | 'lead_captured'
  | 'audit_shared'
  | 'pdf_exported'
  | 'credex_cta_clicked'

export type EventProperties = Record<string, 
  string | number | boolean | null | undefined>

export function trackEvent(
  event: AnalyticsEvent,
  properties?: EventProperties
): void {
  // Guard: do not run on server
  if (typeof window === 'undefined') return

  // Always log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '%c[Analytics]', 
      'color: #22c55e; font-weight: bold',
      event, 
      properties ?? {}
    )
  }

  // In production: swap this block for your real provider
  // Example PostHog: posthog.capture(event, properties)
  // Example Plausible: plausible(event, { props: properties })
  // For now we store events in sessionStorage for debugging
  try {
    const existing = sessionStorage.getItem('credmaster_events')
    const events = existing ? JSON.parse(existing) : []
    events.push({
      event,
      properties,
      timestamp: new Date().toISOString(),
    })
    // Keep only last 50 events in session
    sessionStorage.setItem(
      'credmaster_events',
      JSON.stringify(events.slice(-50))
    )
  } catch {
    // sessionStorage unavailable — fail silently
  }
}

// Helper to get all tracked events (useful for debugging)
export function getTrackedEvents(): Array<{
  event: AnalyticsEvent
  properties?: EventProperties
  timestamp: string
}> {
  if (typeof window === 'undefined') return []
  try {
    const stored = sessionStorage.getItem('credmaster_events')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
