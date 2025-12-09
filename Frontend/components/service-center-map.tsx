"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function ServiceCenterMap() {
    return (
        <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Nearby Service Centers
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative">
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                    <Image
                        src="/Generated/Images/Service-Center-Map.png"
                        alt="Service Center Map"
                        fill
                        className="object-cover"
                    />
                    {/* Interactive overlay could go here, for now it's visual */}
                    <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur p-3 rounded-lg shadow-lg border border-input max-w-xs">
                        <h4 className="font-semibold text-sm">Main Hub - Bangalore</h4>
                        <p className="text-xs text-muted-foreground">1.2 km away • Open now</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
