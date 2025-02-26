import React from "react";

interface WithHeaderLayoutProps {
    children?: React.ReactNode;
    header: {
        title?: string;
        description?: string;
        content?: React.ReactNode;
    };
    className?: string;
    contentClassName?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export default function WithHeaderLayout({
                                             children,
                                             header,
                                             className = "",
                                             contentClassName = "",
                                             maxWidth = "2xl",
                                         }: WithHeaderLayoutProps) {
    const maxWidthClasses = {
        sm: "max-w-2xl",
        md: "max-w-3xl",
        lg: "max-w-5xl",
        xl: "max-w-6xl",
        "2xl": "max-w-7xl",
        "full": "max-w-full"
    };

    return (
        <div className={`min-h-screen bg-background ${className}`}>
            <div className={`mx-auto ${maxWidthClasses[maxWidth]} px-4 sm:px-6 lg:px-8 py-4 ${contentClassName}`}>
                <div className="space-y-6">
                    <header className="space-y-2">
                        {header.content || (
                            <>
                                {header.title && (
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        {header.title}
                                    </h1>
                                )}
                                {header.description && (
                                    <p className="text-muted-foreground">
                                        {header.description}
                                    </p>
                                )}
                            </>
                        )}
                    </header>
                </div>
                {children}
            </div>
        </div>
    );
}