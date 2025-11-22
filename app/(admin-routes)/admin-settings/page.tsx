export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your store settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure your social media contact details
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">WhatsApp Number</label>
              <p className="text-sm text-muted-foreground">
                {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'Not configured'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Snapchat Username</label>
              <p className="text-sm text-muted-foreground">
                {process.env.NEXT_PUBLIC_SNAPCHAT_USERNAME || 'Not configured'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Instagram Username</label>
              <p className="text-sm text-muted-foreground">
                {process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'Not configured'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Store Information</h3>
          <p className="text-sm text-muted-foreground">
            Manage your store details and branding
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Configure email and push notifications
          </p>
        </div>
      </div>
    </div>
  );
}