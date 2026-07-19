import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  MapPin,
  ShieldCheck,
  BellRing,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  const goToParentSignIn = () => {
    navigate("/auth/parent/signin");
  };

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503676685182-2531a01b5b5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzY2hvb2wlMjBidXN8ZW58MHx8fHwxNzUzMjgyMzc5fDA&ixlib=rb-4.1.0&q=85')",
        }}
      />

      {/* Professional dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-blue-950/55" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/80 to-transparent" />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-28 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">

          {/* Main hero content */}
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">

            {/* Badge */}
            <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-blue-300" />
              Smarter and safer school journeys
            </div>

            {/* Main heading */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Know where your child is,
              <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                every step of the journey.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-7 text-slate-200 sm:text-lg sm:leading-8 lg:mx-0">
              Trackefy connects parents, schools and drivers through live bus
              tracking, timely alerts and reliable journey updates—helping every
              child reach school and home more safely.
            </p>

            {/* Trust points */}
            <div className="mx-auto mt-7 grid max-w-xl gap-3 text-sm text-slate-200 sm:grid-cols-2 lg:mx-0">

              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <span>Live bus location updates</span>
              </div>

              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <span>Arrival and trip alerts</span>
              </div>

              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <span>Separate access for every role</span>
              </div>

              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <span>Built for safer school transport</span>
              </div>

            </div>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">

              <Button
                size="lg"
                onClick={goToParentSignIn}
                className="h-14 w-full max-w-sm rounded-xl bg-blue-600 px-7 text-base font-semibold text-white shadow-xl shadow-blue-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-2xl sm:w-auto"
              >
                Start Tracking Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={goToParentSignIn}
                className="h-14 w-full max-w-sm rounded-xl border-white/30 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20 hover:text-white sm:w-auto"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>

            </div>
          </div>

          {/* Desktop feature panel */}
          <div className="hidden lg:block">
            <div className="ml-auto max-w-md rounded-3xl border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">

              <div className="mb-7">
                <p className="text-sm font-medium uppercase tracking-wider text-blue-200">
                  Trackefy platform
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  Everything needed for a safer trip
                </h2>

                <p className="mt-3 leading-6 text-slate-300">
                  One connected system for schools, drivers and parents.
                </p>
              </div>

              <div className="space-y-4">

                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="rounded-xl bg-emerald-400/15 p-3">
                    <MapPin className="h-6 w-6 text-emerald-300" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Live Location
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-300">
                      Follow the school bus journey with continuously updated
                      location information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="rounded-xl bg-orange-400/15 p-3">
                    <BellRing className="h-6 w-6 text-orange-300" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Real-time Alerts
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-300">
                      Receive updates when the trip starts, the bus approaches
                      and the child arrives.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="rounded-xl bg-blue-400/15 p-3">
                    <ShieldCheck className="h-6 w-6 text-blue-300" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Secure Role Access
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-300">
                      Dedicated accounts and dashboards for parents, schools
                      and drivers.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;