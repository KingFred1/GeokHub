import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { getAboutPageContent } from "@/sanity/lib/queries";
import Head from "next/head";
import Image from "next/image";
import PortableTextComponent from "@/components/global/PortableTextComponent";
import Link from "next/link";
import {
  Globe,
  Briefcase,
  Cpu,
  HeartPulse,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

async function AboutPage() {
  const aboutData = await client.fetch(getAboutPageContent);

  const profileImageUrl = aboutData?.profileImage?.asset
    ? urlFor(aboutData.profileImage).width(500).height(500).url()
    : "/default-profile.jpg";

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <Head>
        <title>About GeokHub</title>
        <meta
          name="description"
          content="GeokHub is a digital publication covering world news, business, technology, and lifestyle insights."
        />
      </Head>

      {/* HERO */}
      <section className="border-b bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-sm uppercase tracking-wider text-indigo-600 font-semibold">
              About GeokHub
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              A modern platform for news, technology, and digital insights
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              GeokHub is a digital publication focused on delivering clear,
              reliable, and insightful content across world news, business,
              technology, and lifestyle. Our goal is to help readers stay informed
              and make better decisions in a fast-changing world.
            </p>

            <div className="flex gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Explore Articles
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Founder */}
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-xl overflow-hidden border">
              <Image
                src={profileImageUrl}
                alt="Founder"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Iria Fredrick
              </h3>
              <p className="text-gray-500 text-sm">
                Founder & Editor
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Fullstack developer and content creator focused on building
                useful digital platforms and simplifying complex topics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES (STRONG BRAND SIGNAL) */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-12">
            What We Cover
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-950">
              <Globe className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                World News
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Global events, trends, and important updates shaping the world.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-white dark:bg-gray-950">
              <Briefcase className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Business
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Markets, entrepreneurship, finance, and economic insights.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-white dark:bg-gray-950">
              <Cpu className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Technology
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                AI, cybersecurity, programming, and emerging innovations.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-white dark:bg-gray-950">
              <HeartPulse className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Lifestyle
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Wellness, mental health, productivity, and daily living.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* EDITORIAL PRINCIPLES */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Editorial Approach
          </h2>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            At GeokHub, we prioritize clarity, accuracy, and usefulness. Content
            is created to inform and educate, with a focus on breaking down
            complex topics into understandable insights for a broad audience.
          </p>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We aim to maintain a balanced and responsible approach to publishing,
            ensuring that readers can trust the information presented.
          </p>

          <div className="grid md:grid-cols-3 gap-6 pt-6">
            <div className="p-5 border rounded-lg text-center">
              <ShieldCheck className="mx-auto text-indigo-600 mb-2" />
              <p className="font-medium">Accuracy</p>
            </div>
            <div className="p-5 border rounded-lg text-center">
              <ShieldCheck className="mx-auto text-indigo-600 mb-2" />
              <p className="font-medium">Clarity</p>
            </div>
            <div className="p-5 border rounded-lg text-center">
              <ShieldCheck className="mx-auto text-indigo-600 mb-2" />
              <p className="font-medium">Trust</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t text-center">
        <div className="max-w-3xl mx-auto px-4">
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Stay Informed
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mt-3 mb-6">
            Explore our latest content across news, business, technology, and lifestyle.
          </p>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Browse Articles
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;









// import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
// import { getAboutPageContent } from "@/sanity/lib/queries";
// import Head from "next/head";
// import Image from "next/image";
// import PortableTextComponent from "@/components/global/PortableTextComponent";
// import Link from "next/link";
// import { 
//   Award, 
//   BookOpen, 
//   Users, 
//   Calendar, 
//   Star, 
//   ChevronRight,
//   Target,
//   Lightbulb,
//   Code,
//   PenTool
// } from "lucide-react";

// async function AboutPage() {
//   const aboutData = await client.fetch(getAboutPageContent);

//   const profileImageUrl = aboutData?.profileImage?.asset
//     ? urlFor(aboutData.profileImage).width(500).height(500).url()
//     : "/default-profile.jpg";

//   const expertiseIcons = {
//     development: <Code className="h-6 w-6" />,
//     design: <PenTool className="h-6 w-6" />,
//     writing: <BookOpen className="h-6 w-6" />,
//     strategy: <Target className="h-6 w-6" />,
//     innovation: <Lightbulb className="h-6 w-6" />,
//     default: <Award className="h-6 w-6" />
//   };

//   const getExpertiseIcon = (title) => {
//     const lowerTitle = title.toLowerCase();
//     if (lowerTitle.includes('develop')) return expertiseIcons.development;
//     if (lowerTitle.includes('design')) return expertiseIcons.design;
//     if (lowerTitle.includes('writ')) return expertiseIcons.writing;
//     if (lowerTitle.includes('strateg')) return expertiseIcons.strategy;
//     if (lowerTitle.includes('innovat')) return expertiseIcons.innovation;
//     return expertiseIcons.default;
//   };

//   return (
//     <div className="bg-background min-h-screen">
//       <Head>
//         <title>
//           About {aboutData?.name || "Me"} | {aboutData?.blogTitle || "My Blog"}
//         </title>
//         <meta
//           name="description"
//           content={
//             aboutData?.metaDescription || "Learn more about me and my blog"
//           }
//         />
//       </Head>

//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
//         <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
//             {/* Main Content */}
//             <div className="lg:col-span-7 space-y-8">
//               <div className="space-y-4">
//                 <div className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4">
//                   <Award className="h-5 w-5 text-indigo-600 mr-2" />
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                     About Me
//                   </span>
//                 </div>
                
//                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
//                   Nice to meet you,{" "}
//                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
//                     I&lsquo;m {aboutData?.name || "Your Name"}
//                   </span>
//                 </h1>
                
//                 <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
//                   {aboutData?.shortBio ||
//                     "Passionate about creating meaningful content and sharing knowledge that makes a difference"}
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-4">
//                 <Link
//                   href="/"
//                   className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
//                 >
//                   Read My Articles
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Link>
//                 <Link
//                   href="/contact"
//                   className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   Get In Touch
//                 </Link>
//               </div>
//             </div>

//             {/* Profile Image */}
//             <div className="lg:col-span-5 flex justify-center lg:justify-end">
//               <div className="relative">
//                 <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
//                   <Image
//                     src={profileImageUrl}
//                     alt={aboutData?.profileImage?.alt || "Profile photo"}
//                     fill
//                     className="object-cover"
//                     sizes="(max-width: 1024px) 100vw, 400px"
//                     priority
//                   />
//                 </div>
//                 <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-indigo-600">5+</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">Years Experience</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Bio Section */}
//       <section className="py-20 bg-white dark:bg-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
//             {/* Content */}
//             <div className="lg:col-span-8">
//               <div className="space-y-6">
//                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
//                   My Journey
//                 </h2>
                
//                 <div className="prose prose-lg text-gray-600 dark:text-gray-300 max-w-none">
//                   {aboutData?.bio && (
//                     <PortableTextComponent value={aboutData.bio} />
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
//                   <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white">150+</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">Articles Published</div>
//                   </div>
//                   <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">Readers</div>
//                   </div>
//                   <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <Star className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">Average Rating</div>
//                   </div>
//                   <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <Calendar className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
//                     <div className="text-2xl font-bold text-gray-900 dark:text-white">5+</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">Years Writing</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Side Content */}
//             <div className="lg:col-span-4 space-y-6">
//               <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl text-white">
//                 <h3 className="text-xl font-semibold mb-4">My Mission</h3>
//                 <p className="text-indigo-100">
//                   To create content that educates, inspires, and makes complex topics accessible to everyone.
//                 </p>
//               </div>
              
//               <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Values</h3>
//                 <ul className="space-y-3">
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
//                     <span className="text-gray-600 dark:text-gray-300">Authenticity</span>
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
//                     <span className="text-gray-600 dark:text-gray-300">Quality</span>
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
//                     <span className="text-gray-600 dark:text-gray-300">Innovation</span>
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
//                     <span className="text-gray-600 dark:text-gray-300">Community</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Expertise Section */}
//       <section className="py-20 bg-gray-50 dark:bg-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase mb-4">
//               Expertise
//             </h2>
//             <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
//               Skills & Specializations
//             </h3>
//             <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//               Areas where I excel and bring the most value to my readers
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {aboutData?.expertiseAreas?.map((expertise) => (
//               <div key={expertise._key} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
//                 <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
//                   {getExpertiseIcon(expertise.title)}
//                 </div>
//                 <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//                   {expertise.title}
//                 </h4>
//                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                   {expertise.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       {aboutData?.stats && (
//         <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-16">
//               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
//                 {aboutData.stats.heading}
//               </h2>
//               <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
//                 {aboutData.stats.subheading}
//               </p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
//               {aboutData.stats.items.map((stat) => (
//                 <div key={stat._key} className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
//                   <div className="text-5xl font-bold text-white mb-2">
//                     {stat.value}
//                   </div>
//                   <div className="text-indigo-100 text-lg font-medium">
//                     {stat.label}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Testimonials Section */}
//       {/* {aboutData?.testimonials && (
//         <section className="py-20 bg-white dark:bg-gray-900">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-16">
//               <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase mb-4">
//                 Testimonials
//               </h2>
//               <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
//                 What Readers Say
//               </h3>
//               <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//                 Feedback from the amazing community of readers
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {aboutData.testimonials.map((testimonial) => (
//                 <div key={testimonial._key} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
//                   <div className="flex items-start mb-6">
//                     <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
//                       <Image
//                         src={
//                           testimonial.authorImage?.asset
//                             ? urlFor(testimonial.authorImage)
//                                 .width(200)
//                                 .height(200)
//                                 .url()
//                             : "/default-avatar.jpg"
//                         }
//                         alt={testimonial.authorImage?.alt || "Testimonial author"}
//                         fill
//                         className="object-cover"
//                         sizes="64px"
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
//                         {testimonial.authorName}
//                       </h4>
//                       <p className="text-indigo-600 dark:text-indigo-400 text-sm">
//                         {testimonial.authorTitle}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="text-gray-600 dark:text-gray-300 italic">
//                     "{testimonial.quote}"
//                   </p>
//                   <div className="flex mt-4">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}{aboutData?.testimonials && (
//         <section className="py-20 bg-white dark:bg-gray-900">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-16">
//               <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase mb-4">
//                 Testimonials
//               </h2>
//               <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
//                 What Readers Say
//               </h3>
//               <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//                 Feedback from the amazing community of readers
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {aboutData.testimonials.map((testimonial) => (
//                 <div key={testimonial._key} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
//                   <div className="flex items-start mb-6">
//                     <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
//                       <Image
//                         src={
//                           testimonial.authorImage?.asset
//                             ? urlFor(testimonial.authorImage)
//                                 .width(200)
//                                 .height(200)
//                                 .url()
//                             : "/default-avatar.jpg"
//                         }
//                         alt={testimonial.authorImage?.alt || "Testimonial author"}
//                         fill
//                         className="object-cover"
//                         sizes="64px"
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
//                         {testimonial.authorName}
//                       </h4>
//                       <p className="text-indigo-600 dark:text-indigo-400 text-sm">
//                         {testimonial.authorTitle}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="text-gray-600 dark:text-gray-300 italic">
//                     "{testimonial.quote}"
//                   </p>
//                   <div className="flex mt-4">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )} */}

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
//             Ready to Explore More?
//           </h2>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
//             Dive into my latest articles or reach out to discuss potential collaborations and projects.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               href="/"
//               className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg text-lg font-semibold"
//             >
//               Browse Articles
//               <ChevronRight className="ml-2 h-5 w-5" />
//             </Link>
//             <Link
//               href="/contact"
//               className="inline-flex items-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-lg font-semibold"
//             >
//               Get In Touch
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AboutPage;