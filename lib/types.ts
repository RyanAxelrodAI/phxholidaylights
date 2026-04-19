export interface Location {
  id: string
  address: string
  street: string
  city: string
  state: string
  zip: string
  description: string | null
  lat: number
  lng: number
  verified: boolean
  created_at: string
  isNew: boolean
}

export interface Submission {
  id: string
  address: string
  description: string | null
  lat: number
  lng: number
  submitted_by: string | null
  email: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface Feedback {
  id: string
  location_id: string
  location?: Location
  type: 'still_active' | 'no_longer_active' | 'update_needed' | 'note'
  message: string | null
  submitted_by: string | null
  created_at: string
}

export const FEEDBACK_LABELS: Record<Feedback['type'], string> = {
  still_active: '✅ Still active & looking great!',
  no_longer_active: '❌ No longer active',
  update_needed: '📝 Update needed',
  note: '💬 General note',
}
