'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Category, Municipality } from '@prisma/client'

export default function EventForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || Category.OSTALO,
    municipality: initialData?.municipality || Municipality.HVAR,
    location: initialData?.location || '',
    address: initialData?.address || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    time: initialData?.time || '',
    description: initialData?.description || '',
    tags: initialData?.tags?.join(', ') || '',
    website: initialData?.website || '',
    maxCapacity: initialData?.maxCapacity || '',
    isFree: initialData?.isFree || false,
    price: initialData?.price || 0,
    imageUrl: initialData?.imageUrl || '',
    imagePublicId: initialData?.imagePublicId || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked, price: checked ? 0 : prev.price }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        maxCapacity: formData.maxCapacity ? Number(formData.maxCapacity) : null,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        startDate: new Date(formData.startDate).toISOString(),
      }

      const url = initialData ? `/api/events/${initialData.id}` : '/api/events'
      const method = initialData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Something went wrong')
      }

      router.push('/dashboard/events')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold">Step 1: Basic Information</h3>
          <Input label="Event Title" name="title" value={formData.title} onChange={handleChange} required />
          
          <div>
            <label className="block text-sm font-medium text-[var(--ink)] mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md px-3 py-2 bg-[var(--mist)]">
              {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ink)] mb-1">Municipality</label>
            <select name="municipality" value={formData.municipality} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md px-3 py-2 bg-[var(--mist)]">
              {Object.values(Municipality).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <Input label="Location Name" name="location" value={formData.location} onChange={handleChange} required />
          <Input label="Address (Optional)" name="address" value={formData.address} onChange={handleChange} />
          
          <div className="flex justify-end pt-4">
            <Button type="button" onClick={nextStep}>Next step &rarr;</Button>
          </div>
        </div>
      )}

      {/* STEP 2: Date & Details */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h3 className="text-lg font-bold">Step 2: Date & Time</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
            <Input label="Time (HH:MM)" name="time" type="time" value={formData.time} onChange={handleChange} required />
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium text-[var(--ink)] mb-1">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={5}
              required
              className="w-full border border-[var(--border)] rounded-md px-3 py-2 bg-[var(--mist)] focus:outline-none focus:ring-2 focus:ring-[var(--sea)]"
            />
          </div>

          <Input label="Tags (comma separated)" name="tags" value={formData.tags} onChange={handleChange} placeholder="music, live, outdoor" />
          <Input label="Website URL (Optional)" name="website" type="url" value={formData.website} onChange={handleChange} />
          <Input label="Max Capacity (Optional)" name="maxCapacity" type="number" value={formData.maxCapacity} onChange={handleChange} />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="secondary" onClick={prevStep}>&larr; Back</Button>
            <Button type="button" onClick={nextStep}>Next step &rarr;</Button>
          </div>
        </div>
      )}

      {/* STEP 3: Pricing & Media */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h3 className="text-lg font-bold">Step 3: Pricing & Media</h3>
          
          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="isFree" 
              name="isFree" 
              checked={formData.isFree} 
              onChange={handleChange} 
              className="rounded text-[var(--sea)] focus:ring-[var(--sea)] h-4 w-4"
            />
            <label htmlFor="isFree" className="text-sm font-medium text-[var(--ink)]">This is a free event</label>
          </div>

          {!formData.isFree && (
            <Input 
              label="Ticket Price (€)" 
              name="price" 
              type="number" 
              min="0" 
              step="0.01" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
          )}

          <div className="pt-4">
            <label className="block text-sm font-medium text-[var(--ink)] mb-2">Event Image</label>
            <ImageUpload 
              value={formData.imageUrl} 
              onChange={(url, publicId) => setFormData(prev => ({ ...prev, imageUrl: url, imagePublicId: publicId }))} 
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="secondary" onClick={prevStep}>&larr; Back</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : initialData ? 'Update Event' : 'Submit for Review'}
            </Button>
          </div>
          {!initialData && <p className="text-xs text-[var(--muted)] text-right mt-2">Event will be reviewed within 24 hours.</p>}
        </div>
      )}
    </form>
  )
}
