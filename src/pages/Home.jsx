const Home = () => (
  <div className="bg-gradient-to-r from-primary to-accent text-white rounded-xl p-8 shadow-lg">
  <section className="bg-white/90 dark:bg-gray-800 rounded-xl p-8 shadow-xl max-w-4xl mx-auto text-center">
    <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Welcome to stunews</h1>
    <p className="text-lg text-gray-700 dark:text-gray-200">Your gateway to announcements, events, results, and more.</p>
    <div className="mt-6 flex justify-center gap-4">
      <a href="/announcements" className="btn-brand">View Announcements</a>
      <a href="/events" className="btn-brand bg-white/20">Events</a>
    </div>
  </section>
  </div>
);

export default Home;
