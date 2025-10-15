"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Car, Clock, Mail, MapPin, Phone } from "lucide-react";
import { UnifiedNavbar } from "@/components/navbar";

// Mock car data
const cars = [
  { id: "car-1", name: "Skoda Superb", year: 2023, mileage: 12500 },
  { id: "car-2", name: "Toyota Fortuner", year: 2024, mileage: 8900 },
  { id: "car-3", name: "Toyota Innova", year: 2023, mileage: 15600 },
];

export default function AppointmentBookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    carId: "car-1",
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    serviceType: "general",
    additionalNotes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment form submitted:", formData);
    setSubmitted(true);

    setTimeout(() => {
      router.push("/dashboard-new");
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center p-4">
        <UnifiedNavbar />
        <div className="max-w-md w-full bg-background rounded-xl border border-input p-8 shadow-lg text-center mt-16">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been scheduled. We'll contact you shortly to
            confirm.
          </p>
          <Button
            onClick={() => router.push("/dashboard-new")}
            className="w-full bg-black hover:bg-black/90"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-background py-12 px-4">
      <UnifiedNavbar />
      <div className="max-w-4xl mx-auto pt-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Futurista Service Appointment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Book a service appointment for your vehicle. Our certified
            technicians will provide top-quality maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Centers */}
          <div className="bg-card rounded-xl border border-input p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Service Centers
            </h2>

            <div className="space-y-4">
              <div className="p-4 border border-input rounded-lg hover:bg-accent transition-colors">
                <h3 className="font-medium text-foreground">Downtown Service Center</h3>
                <p className="text-sm text-muted-foreground">120 Market St.</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-green-600">Open now</span>
                  <span className="text-foreground">5 min away</span>
                </div>
              </div>

              <div className="p-4 border border-black/10 rounded-xl hover:bg-gray-50 transition-colors">
                <h3 className="font-medium">Northside Maintenance Hub</h3>
                <p className="text-sm text-gray-600">431 Woodland Ave.</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-green-600">Open now</span>
                  <span>12 min away</span>
                </div>
              </div>

              <div className="p-4 border border-black/10 rounded-xl hover:bg-gray-50 transition-colors">
                <h3 className="font-medium">Express Care Center</h3>
                <p className="text-sm text-gray-600">780 Highway 101</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-green-600">Open now</span>
                  <span>18 min away</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-xl border border-input p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5" />
              Appointment Details
            </h2>

            <div className="space-y-6">
              {/* Car Selection */}
              <div>
                <Label htmlFor="carId">Select Your Vehicle</Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className={`border rounded-xl p-3 cursor-pointer transition-all ${
                        formData.carId === car.id
                          ? "border-black bg-blue-50"
                          : "border-black/10 hover:border-black/30"
                      }`}
                      onClick={() => handleSelectChange("carId", car.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span className="font-medium">{car.name}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {car.year} • {car.mileage.toLocaleString()} km
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) =>
                      handleSelectChange("serviceType", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">
                        General Maintenance
                      </SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="oil">Oil Change</SelectItem>
                      <SelectItem value="brakes">Brake Service</SelectItem>
                      <SelectItem value="engine">Engine Service</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any specific issues or concerns?"
                  className="mt-2"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-6 text-lg"
              >
                Schedule Appointment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
