import React from "react";

const AboutUs = () => {
  return (
    <div>
      <section className="bg-[#FCFBF9] py-24 dark:bg-[#0f111a]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
          {/* Left Side: Heritage image of the studio */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-full w-full border border-red-200 transition-transform duration-500 dark:border-red-800/70"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-200 shadow-2xl shadow-stone-900/20 dark:bg-stone-800 dark:shadow-black/40">
              <img
                src="/facility.jpg"
                alt="Inside the Samlason Printing Press studio"
                loading="lazy"
                className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 hover:grayscale-0 motion-reduce:transition-none"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10"
              />
            </div>
          </div>

          {/* Right Side: Copy */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-stone-300 dark:bg-stone-600" />
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                  Our Heritage
                </h3>
              </div>
              <h2 className="font-serif text-4xl leading-tight text-stone-900 md:text-5xl dark:text-stone-100">
                Where Tradition <br /> meets{" "}
                <em className="font-light text-red-800 dark:text-red-600">
                  Technology.
                </em>
              </h2>
            </div>

            <p className="text-base font-light leading-[1.8] text-stone-600 dark:text-stone-300">
              Ink of Memories is the digital evolution of{" "}
              <strong className="font-medium text-stone-900 dark:text-stone-100">
                Samlason Printing Press
              </strong>
              . We combine decades of physical craftsmanship with high-end
              software engineering to create paper artifacts that last a
              lifetime.
            </p>

            <div className="grid grid-cols-2 gap-8 border-t border-stone-200 pt-8 dark:border-stone-700">
              <div>
                <span className="block font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
                  Panchkula
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  Physical Studio
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
                  Worldwide
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500">
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
