"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/context/auth-context'
import { format } from 'date-fns'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, AlertCircle, CameraIcon } from 'lucide-react'

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date and time"
  }),
  location: z.string().min(5, "Location must be at least 5 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  total_seats: z.coerce.number().min(1, "Total seats must be at least 1"),
  image_url: z.string().optional()
})

export default function CreateEvent() {
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [createdEvent, setCreatedEvent] = useState<any>(null)
  
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      location: "",
      price: 0,
      total_seats: 100,
      image_url: ""
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to your server/Cloudinary
      // For this demo, we'll just set a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        // In a real implementation, you would get the URL after upload
        form.setValue("image_url", "https://res.cloudinary.com/didqk3bwj/image/upload/v1743248850/images_wujdgr.jpg")
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleCreateEvent = async (values: z.infer<typeof eventFormSchema>) => {
    setIsCreating(true)
    setError(null)
    setSuccess(false)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://127.0.0.1:8000/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...values,
          organizer_email: user?.email || "organizer@example.com",
          total_seats: values.total_seats,
          available_seats: values.total_seats,
          // In a real app, you would handle image upload separately
          image_url: values.image_url || "https://res.cloudinary.com/didqk3bwj/image/upload/v1743248850/images_wujdgr.jpg"
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create event')
      }
      
      const newEvent = await response.json()
      setCreatedEvent(newEvent)
      setSuccess(true)
      form.reset()
    } catch (error: any) {
      console.error('Error creating event:', error)
      setError(error.message || 'An error occurred while creating the event')
    } finally {
      setIsCreating(false)
    }
  }

  const isOrganizerApproved = user?.status === 'approved'

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">Create New Event</h1>
      
      {!isOrganizerApproved && (
        <Alert className="border-amber-200 dark:border-amber-800/30 mb-6">
          <AlertCircle className="h-5 w-5 text-amber-800 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-medium">Account approval pending</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            Your organizer account requires admin approval before you can create events. 
            Please check back later or contact support for more information.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && createdEvent && (
        <Alert variant="success" className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30">
          <div className="h-5 w-5 text-green-600 dark:text-green-400">✓</div>
          <AlertTitle className="text-green-800 dark:text-green-400 font-medium">Event Created Successfully</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            Your event "{createdEvent.title}" has been created and is pending approval.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-purple-600 dark:text-purple-400">Event Details</CardTitle>
          <CardDescription>
            Fill out the form below to create your new event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateEvent)} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Event Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="focus:border-purple-500 focus:ring-purple-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="focus:border-purple-500 focus:ring-purple-500 min-h-32" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Date & Time</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="datetime-local"
                              className="focus:border-purple-500 focus:ring-purple-500" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Location</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="focus:border-purple-500 focus:ring-purple-500" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Price ($)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              min="0"
                              step="0.01"
                              className="focus:border-purple-500 focus:ring-purple-500" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="total_seats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-300">Total Seats</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              min="1"
                              className="focus:border-purple-500 focus:ring-purple-500" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-64 space-y-4">
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Event Image</FormLabel>
                    <div className="flex flex-col items-center">
                      <div className="w-full h-48 rounded-md overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center mb-3">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Event preview" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="text-center p-4">
                            <CameraIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Upload event image
                            </p>
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full cursor-pointer border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/30"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          Choose Image
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Recommended: 16:9 ratio, max 5MB
                      </p>
                    </div>
                  </FormItem>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isCreating || !isOrganizerApproved}
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {createdEvent && (
        <Card className="mt-8 border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-purple-600 dark:text-purple-400">Event Created</CardTitle>
            <CardDescription>
              This is the data that was sent to the server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(createdEvent, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}