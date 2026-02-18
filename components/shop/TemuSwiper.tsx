"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Air Pump For Car Tires DC1",
    image: "https://img.kwcdn.com/product/fancy/2d14ac1f-790b-4d0f-bfc1-e05b8e582834.jpg?imageView2/2/w/800/q/70/format/webp",
    link: "https://temu.to/k/u0nv2agt92j",
  },
  {
    id: 2,
    name: "Mini Men's Electric Shaver...",
    image: "https://img.kwcdn.com/product/fancy/42523e20-9cdd-414e-9050-dc1f72f5548f.jpg?imageView2/2/w/800/q/70/format/webp",
    link: "https://temu.to/k/uguc7u5s2yz",
  },
  {
    id: 3,
    name: "16 In 1 Vegetable Chopper ...",
    image: "https://img.kwcdn.com/product/fancy/68af76dc-11fd-40c3-b9ee-e03bd3612afa.jpg?imageView2/2/w/800/q/70/format/webp",
    link: "https://temu.to/k/ug6ylct927m",
  },
  {
    id: 4,
    name: "3-in-1 Portable Air Conditioner, Humidifier & Fan",
    image: "https://img.kwcdn.com/product/fancy/0064ff38-0d49-4734-9d42-d3dd3374db33.jpg?imageView2/2/w/800/q/70/format/webp",
    link: "https://temu.to/k/ubz8ak436po",
  },
  {
    id: 5,
    name: "Handheld Vacuum Cleaner Wireless",
    image: "https://img-1.kwcdn.com/product/fancy/890dbb5c-6e1c-4119-b709-953d58edb010.jpg?imageView2/2/w/800/q/70/format/webp",
    link: "https://temu.to/k/um3euuqlpba",
  },
  {
    id: 6,
    name: "5-tier Multifunctional Metal Coat Rack",
    image: "https://img.kwcdn.com/product/fancy/9930c633-449a-416e-8a88-d7968af601c7.jpg?imageView2/2/w/800/q/70/format/webp",
    link: "https://temu.to/k/uxt5ooe1s30",
  },
  {
    id: 7,
    name: "[No Drilling] Bathroom Corner Shower Rack",
    image: "https://img.kwcdn.com/product/fancy/6a8ab562-0c18-4b70-8154-cb1eae320569.jpg?imageView2/2/w/800/q/70/format/webp",
    link: "https://temu.to/k/uouxtii0n2n",
  },
];

export default function TemuSwiper() {
  return (
    <div className="w-full max-w-7xl mx-auto py-5">
      {/* <h2 className="text-2xl font-semibold mb-4 text-center">🔥 Trending on Temu</h2> */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        // pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="bg-card p-4 rounded-xl shadow-md text-center hover:scale-105 transition">
              <Image
                src={product.image}
                alt={product.name}
                width={10000}
                height={10000}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className=" mx-auto rounded-lg object-cover"
              />
              <h3 className="mt-4 font-medium text-lg line-clamp-1">{product.name}</h3>
              <Link
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Shop Now
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
