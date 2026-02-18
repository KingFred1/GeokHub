import React from "react";
import Link from "next/link";

const AdvertiseWithUs = () => {
  return (
    <section className="bg-blue-600 text-white rounded-xl p-6 md:p-8 mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="group grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 md:col-span-9">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Advertise With GeokHub
          </h2>
          <p className="text-white/90 mb-4 text-sm md:text-base">
            Connect your brand with a highly engaged, tech-savvy audience. GeokHub offers sponsored posts, banner ads, newsletters, and custom campaigns 
            designed to maximize your reach and impact. Let’s grow together and create meaningful digital partnerships.
          </p>
          <Link href="/contact">
            <span className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition">
              Contact Us
            </span>
          </Link>
        </div>
        <div className="col-span-12 md:col-span-3">
          <img
            src="/images/advertise-illustration.jpg"
            alt="Advertise with us"
            className="w-full h-auto rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default AdvertiseWithUs;
