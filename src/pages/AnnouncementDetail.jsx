import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnnouncementById } from '../services/announcementService';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { supabase } from '../services/supabaseClient';

const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url || '');

const AnnouncementDetail = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await getAnnouncementById(id);
      const ann = data || null;
      setAnnouncement(ann);

      // If announcement has an author_id, try to fetch admin info
      if (ann?.author_id) {
        try {
          const { data: admin, error } = await supabase.from('admins').select('id,name,email').eq('id', ann.author_id).single();
          if (error) {
            console.warn('failed to fetch admin', error);
            setAuthor(null);
          } else {
            setAuthor(admin || null);
          }
        } catch (err) {
          console.warn('fetch admin failed', err);
          setAuthor(null);
        }
      }
    };
    load();
  }, [id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    } catch (err) {
      // fallback
      // eslint-disable-next-line no-console
      console.warn('clipboard write failed', err);
      prompt('Copy this link', window.location.href);
    }
  };

  const doPrint = () => {
    window.print();
  };

  const doShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: announcement?.title, url: window.location.href });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('navigator.share failed', err);
      }
    } else {
      copyLink();
    }
  };

  if (!announcement) return <div className="p-4">Announcement not found or loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <Link to="/announcements" className="text-sm text-primary hover:underline">← Back to announcements</Link>
        <div className="flex items-center gap-2">
          <button onClick={copyLink} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">Copy link</button>
          <button onClick={doPrint} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">Print</button>
          <button onClick={doShare} className="px-3 py-1 rounded bg-primary text-white text-sm">Share</button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mt-1">{announcement.title}</h1>
      {announcement.summary && <p className="text-gray-700 dark:text-gray-300 mt-2">{announcement.summary}</p>}
      <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
        <span>{new Date(announcement.created_at).toLocaleString()}</span>
        {author && <span>• By {author.name || author.email}</span>}
      </div>

      <div className="mt-6 prose dark:prose-invert">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{announcement.content || announcement.summary || ''}</ReactMarkdown>
      </div>

      {announcement.file_url && (
        <div className="mt-4">
          {isImageUrl(announcement.file_url) ? (
            <img src={announcement.file_url} alt="attachment" className="max-w-full rounded shadow" />
          ) : (
            <a href={announcement.file_url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-primary underline">
              Download attachment
            </a>
          )}
        </div>
      )}

      {announcement.metadata && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-3 rounded">
          <h3 className="text-sm font-medium mb-2">Metadata</h3>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(announcement.metadata, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AnnouncementDetail;
