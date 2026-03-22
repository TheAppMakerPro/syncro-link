import RegistrationForm from "@/components/registry/RegistrationForm";

export const metadata = {
  title: "Register — Syncro-Link Index Registry",
};

export default function RegistryPage() {
  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wider mb-3"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Syncro-Link Index Registry
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Register yourself as a point of light on the world grid. This is
            your platform for mass ascension.
          </p>
          <p className="text-white/80 max-w-xl mx-auto mt-4 font-semibold text-sm tracking-wide">
            Welcome to the World Wide 5th Density 144,000 node light grid. Here
            is where the anchoring begins.
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
}
