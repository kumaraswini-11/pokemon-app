import Link from "next/link";
import React from "react";

import {AlertCircle} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="border-border w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive size-8" />
          </div>
          <CardTitle className="text-foreground text-2xl font-bold">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Oops! It looks like this Pokemon has wandered off into the tall grass. The page you’re
            looking for doesn’t exist or has been moved.
          </p>
          <Button
            asChild
            variant="default"
            className="mt-4">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
