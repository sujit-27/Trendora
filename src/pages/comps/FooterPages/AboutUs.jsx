import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        About Us
      </h1>

      {/* Our Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-rose-600 mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          Our mission is to create a simple and user-friendly platform that connects buyers and sellers, enabling easy and enjoyable online shopping experiences.
        </p>
      </section>

      {/* Our Vision */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-rose-600 mb-4">Our Vision</h2>
        <p className="text-gray-700 leading-relaxed">
          To become a trusted marketplace where everyone can discover quality products and grow their business with confidence.
        </p>
      </section>

      {/* Our Values */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-600 mb-4">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Honesty and transparency in all dealings.</li>
          <li>Providing excellent customer service.</li>
          <li>Encouraging innovation and creativity.</li>
          <li>Building a safe and friendly online community.</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
