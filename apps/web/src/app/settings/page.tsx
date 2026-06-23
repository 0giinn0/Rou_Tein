"use client";

import { Card, Input, Button } from "@ticktick/ui";
import { User, Target } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-s4 space-y-s4 pb-28">
      <header>
        <h1 className="text-2xl font-bauhaus text-cream">Settings</h1>
        <p className="text-sm text-muted mt-s1">Manage your profile and goals</p>
      </header>

      <Card className="p-s4 rounded-3xl glass">
        <div className="flex items-center gap-s3 mb-s4">
          <div className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center">
            <User className="w-5 h-5 text-ink" />
          </div>
          <h2 className="text-base font-bauhaus text-cream">Profile</h2>
        </div>
        <div className="space-y-s3 max-w-md">
          <Input label="Name" defaultValue="User" className="rounded-xl" />
          <Input label="Email" type="email" defaultValue="user@example.com" className="rounded-xl" />
          <Button className="rounded-full">Save Changes</Button>
        </div>
      </Card>

      <Card className="p-s4 rounded-3xl glass">
        <div className="flex items-center gap-s3 mb-s4">
          <div className="w-10 h-10 rounded-2xl bg-coral flex items-center justify-center">
            <Target className="w-5 h-5 text-ink" />
          </div>
          <h2 className="text-base font-bauhaus text-cream">Nutrition Goals</h2>
        </div>
        <div className="grid grid-cols-2 gap-s3 max-w-md">
          <Input label="Daily Calories (kcal)" type="number" defaultValue="2000" className="rounded-xl" />
          <Input label="Protein (g)" type="number" defaultValue="150" className="rounded-xl" />
          <Input label="Carbs (g)" type="number" defaultValue="250" className="rounded-xl" />
          <Input label="Fat (g)" type="number" defaultValue="65" className="rounded-xl" />
          <div className="col-span-2 pt-s1">
            <Button className="rounded-full">Update Goals</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
