import { useEffect, useState } from 'react';
import { fetchAnnouncements } from '../services/announcementService';
import AnnouncementCard from '../components/AnnouncementCard';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const { data } = await fetchAnnouncements();
      setAnnouncements(data || []);
    };
    loadAnnouncements();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Latest Announcements</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((a) => {
          if (!a?.id) console.warn('Announcement missing id', a);
          return (
            <AnnouncementCard
              key={a.id || JSON.stringify(a)}
              id={a.id}
              title={a.title}
              summary={a.summary}
              content={a.content}
              file_url={a.file_url}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Announcements;
