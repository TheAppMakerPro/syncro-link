import RegistrationForm from "@/components/registry/RegistrationForm";

export const metadata = {
  title: "Register — Syncro-Link Index Registry",
};

export default function RegistryPage() {
  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wider mb-4 text-[#1a1200]"
            style={{
              fontFamily: "var(--font-space)",
            }}
          >
            Syncro-Link Index Registry
          </h1>
          <p className="text-[#4a3d00] max-w-xl mx-auto">
            Register yourself as a point of light on the world grid. We only ask
            four things of you.
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
}
