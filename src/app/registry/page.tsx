import RegistrationForm from "@/components/registry/RegistrationForm";

export const metadata = {
  title: "Register — Syncro-Link Index Registry",
};

export default function RegistryPage() {
  return (
    <div className="min-h-screen px-4 py-16 sm:px-6">
      <div className="text-center mb-12">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-wider mb-4 text-[#1a1200]"
          style={{
            fontFamily: "var(--font-space)",
            textShadow: "0 0 30px rgba(138,109,0,0.2)",
          }}
        >
          Syncro-Link Index Registry
        </h1>
        <p className="text-[#4a3d00]/70 max-w-xl mx-auto">
          Register yourself as a point of light on the world grid. We only ask
          four things of you.
        </p>
      </div>
      <RegistrationForm />
    </div>
  );
}
