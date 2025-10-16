import { Link } from 'react-router-dom'

const Footer = ({ showInfo = true }) => (
  <footer className="bg-gradient-to-r from-primary to-accent text-white mt-12">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white/8 bg-opacity-5 p-6 rounded-md">
      {showInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-sm">
              stunews is the student information portal for announcements, events and academic results.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li><Link to="/events" className="hover:text-white/80">Events</Link></li>
              <li><Link to="/announcements" className="hover:text-white/80">Announcements</Link></li>
              <li><Link to="/results" className="hover:text-white/80">Results</Link></li>
              <li><Link to="/archive" className="hover:text-white/80">Archive</Link></li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6 border-t pt-4 text-center text-sm">
        © {new Date().getFullYear()} stunews. All rights reserved.
      </div>
    </div>
    </div>
  </footer>
)

export default Footer
