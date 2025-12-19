export interface Monitor {
    captureException(error: unknown, context?: Record<string, unknown>): void;
    log(message: string, context?: Record<string, unknown>): void;
}

class ConsoleMonitor implements Monitor {
    captureException(error: unknown, context?: Record<string, unknown>) {
        console.error("Monitor Error:", error, context);
    }
    log(message: string, context?: Record<string, unknown>) {
        console.log("Monitor Log:", message, context);
    }
}

class RemoteMonitor implements Monitor {
    private sentryDsn?: string;
    private logtailToken?: string;

    constructor() {
        this.sentryDsn = process.env.SENTRY_DSN;
        this.logtailToken = process.env.LOGTAIL_SOURCE_TOKEN;
    }

    captureException(error: unknown, context?: Record<string, unknown>) {
        // Fallback to console
        console.error("Monitor Error:", error, context);

        // Placeholder for Sentry integration
        if (this.sentryDsn) {
            // In a real implementation: Sentry.captureException(error, { extra: context });
            // For MVP without SDK: could fire fire-and-forget fetch to Sentry API if critical
        }
    }

    log(message: string, context?: Record<string, unknown>) {
        console.log("Monitor Log:", message, context);

        // Placeholder for Logtail integraiton
        if (this.logtailToken) {
            // In a real implementation: logtail.info(message, context);
        }
    }
}

export const monitor: Monitor = (process.env.SENTRY_DSN || process.env.LOGTAIL_SOURCE_TOKEN)
    ? new RemoteMonitor()
    : new ConsoleMonitor();
