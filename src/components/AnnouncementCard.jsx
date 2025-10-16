import { Link } from 'react-router-dom';

const AnnouncementCard = ({ id, title, summary, content, file_url }) => {
  const safeTitle = title ?? 'Untitled announcement';
  const safeSummary = summary ?? '';
  const preview = content ? (content.length > 200 ? content.slice(0, 200) + '…' : content) : safeSummary;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-primary dark:text-accent">{safeTitle}</h2>
      {safeSummary && <p className="text-sm text-gray-600 dark:text-gray-300">{safeSummary}</p>}
      {preview && <p className="mt-2 text-sm">{preview}</p>}
      <div className="mt-3 flex items-center gap-3">
        {id ? (
          <Link to={`/announcements/${id}`} className="text-sm text-primary hover:underline">Read more</Link>
        ) : (
          <span className="text-sm text-gray-500">Read more (unavailable)</span>
        )}
        {file_url && (
          <a href={file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
            Download Attachment
          </a>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
