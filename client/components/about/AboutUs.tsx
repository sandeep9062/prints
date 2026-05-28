import React from "react";

const AboutUs = () => {
  return (
    <div>
      <section className="py-24 bg-[#fdfcfb]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Side: Heritage Image/Video of your Shop */}
          <div className="relative group">
            <div className="absolute -inset-4 border border-gray-200 rounded-sm translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
            <video
              src="/Memories-spinner.mp4"
              autoPlay
              muted
              loop
              className="relative z-10 w-full h-[500px] object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Right Side: Copy */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-sm uppercase tracking-[0.3em] text-red-800 font-semibold">
                Our Heritage
              </h3>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
                Where Tradition <br /> meets{" "}
                <span className="italic">Technology</span>.
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed font-light text-lg">
              Ink of Memories is the digital evolution of{" "}
              <strong className="font-medium text-gray-800">
                Samlason Printing Press
              </strong>
              . We combine decades of physical craftsmanship with high-end
              software engineering to create paper artifacts that last a
              lifetime.
            </p>

            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-8">
              <div>
                <span className="block text-2xl font-serif text-gray-900">
                  Panchkula
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  Physical Studio
                </span>
              </div>
              <div>
                <span className="block text-2xl font-serif text-gray-900">
                  Worldwide
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  Digital Atelier
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
