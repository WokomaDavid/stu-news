import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/eventService';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      const { data } = await fetchEvents();
      setEvents(data || []);
    };
    loadEvents();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-accent mb-4">Upcoming Events</h1>
<ul className="space-y-4">
  {events.map((event) => (
    <li key={event.id} className="border p-4 rounded shadow bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-primary">{event.title}</h2>
      <p>{event.description}</p>
      <p className="text-sm text-gray-500">Date: {new Date(event.date).toDateString()}</p>
    </li>
  ))}
</ul>

    </div>
  );
};

export default Events;
