import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Calendar, SearchX } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                    <div className="h-1 w-32 bg-primary mx-auto mt-4"></div>
                </div>

                {/* Message */}
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold text-foreground mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
                    </p>
                </div>

                {/* Illustration */}
                <div className="mb-8 flex justify-center animate-bounce">
                    <SearchX className="h-24 w-24 text-muted-foreground/30" strokeWidth={1.5} />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button asChild size="lg">
                        <Link href="/">
                            <Home className="h-5 w-5 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/">
                            <Calendar className="h-5 w-5 mr-2" />
                            Browse Events
                        </Link>
                    </Button>
                </div>

                {/* Additional Help */}
                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Looking for something specific?{" "}
                        <Link href="/" className="text-primary hover:underline font-medium">
                            Visit our homepage
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
