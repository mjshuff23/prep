import { requireUser } from "@/lib/auth-helpers";

export default async function SettingsPage() {
  await requireUser();
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account preferences and application settings.</p>
      
      <div className="space-y-6">
        <section className="p-6 border rounded-xl bg-card">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <p className="text-sm text-muted-foreground mb-4">Update your basic profile information.</p>
          <div className="p-4 bg-muted/20 border-dashed border rounded flex items-center justify-center">
            Profile Settings Placeholder
          </div>
        </section>

        <section className="p-6 border rounded-xl bg-card">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <p className="text-sm text-muted-foreground mb-4">Customize how the application looks on your device.</p>
          <div className="p-4 bg-muted/20 border-dashed border rounded flex items-center justify-center">
            Theme Selector Placeholder
          </div>
        </section>
      </div>
    </div>
  );
}
