// src/app/(dashboard)/events/create/page.tsx
import { EventCreateForm } from '@/components/events/EventCreateForm';

export default function EventCreatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Host Your Event
      </h1>
      <EventCreateForm />
    </div>
  );
}