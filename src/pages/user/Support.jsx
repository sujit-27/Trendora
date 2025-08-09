import React, { useState } from "react";

export default function Support() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !message.trim()) {
      setError("Please fill in both email and your message.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center max-w-xl mx-auto text-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Thank you!</h2>
        <p>Your message has been received. Our support team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl text-gray-700">
      <h2 className="text-2xl font-semibold mb-6">Support & Help</h2>
      <p className="mb-6">If you have any questions or issues, please send us a message below:</p>

      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="message">
            Your Message
          </label>
          <textarea
            id="message"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
            className="w-full p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="bg-rose-500 text-white font-semibold px-6 py-3 rounded-md hover:bg-rose-600 transition cursor-pointer"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
