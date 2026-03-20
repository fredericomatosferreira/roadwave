export interface RoadmapTemplate {
  id: string;
  name: string;
  description: string;
  columns: {
    title: string;
    cards: {
      title: string;
      description: string;
      status: "planned" | "in_progress" | "done";
      tag: string;
    }[];
  }[];
}

export const templates: RoadmapTemplate[] = [
  {
    id: "empty",
    name: "Empty Roadmap",
    description: "Start from scratch with three default columns.",
    columns: [
      { title: "Now", cards: [] },
      { title: "Next", cards: [] },
      { title: "Later", cards: [] },
    ],
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description:
      "Plan a product launch from discovery through post-launch iteration.",
    columns: [
      {
        title: "Discovery",
        cards: [
          {
            title: "User research interviews",
            description:
              "Conduct 10+ interviews with target users to validate the problem space and identify key pain points.",
            status: "in_progress",
            tag: "Research",
          },
          {
            title: "Competitive analysis",
            description:
              "Analyze 5 direct competitors and document feature gaps and positioning opportunities.",
            status: "done",
            tag: "Research",
          },
          {
            title: "Define success metrics",
            description:
              "Establish KPIs: activation rate, D7 retention, NPS score, and revenue targets.",
            status: "planned",
            tag: "Strategy",
          },
        ],
      },
      {
        title: "Building",
        cards: [
          {
            title: "Core feature MVP",
            description:
              "Build the minimum feature set needed to deliver the primary value proposition.",
            status: "in_progress",
            tag: "Engineering",
          },
          {
            title: "Onboarding flow",
            description:
              "Design and implement a guided onboarding experience for new users.",
            status: "planned",
            tag: "Design",
          },
          {
            title: "Analytics integration",
            description:
              "Set up event tracking for all key user actions to measure success metrics.",
            status: "planned",
            tag: "Engineering",
          },
        ],
      },
      {
        title: "Launch",
        cards: [
          {
            title: "Beta testing program",
            description:
              "Recruit 50 beta users and run a 2-week testing period with structured feedback collection.",
            status: "planned",
            tag: "Product",
          },
          {
            title: "Launch marketing campaign",
            description:
              "Coordinate Product Hunt launch, blog post, email blast, and social media announcements.",
            status: "planned",
            tag: "Marketing",
          },
          {
            title: "Documentation & help center",
            description:
              "Write getting-started guides, FAQ, and API documentation.",
            status: "planned",
            tag: "Docs",
          },
        ],
      },
      {
        title: "Post-Launch",
        cards: [
          {
            title: "Collect user feedback",
            description:
              "Set up in-app feedback widget and schedule follow-up calls with early adopters.",
            status: "planned",
            tag: "Product",
          },
          {
            title: "Performance optimization",
            description:
              "Address load time issues, optimize database queries, and improve Core Web Vitals.",
            status: "planned",
            tag: "Engineering",
          },
        ],
      },
    ],
  },
  {
    id: "quarterly-planning",
    name: "Quarterly Planning",
    description:
      "Organize your team's quarterly OKRs and initiatives across time horizons.",
    columns: [
      {
        title: "This Quarter",
        cards: [
          {
            title: "Improve onboarding conversion",
            description:
              "Increase signup-to-activation rate from 35% to 50% by simplifying the first-run experience.",
            status: "in_progress",
            tag: "Growth",
          },
          {
            title: "Ship team collaboration features",
            description:
              "Add shared workspaces, commenting, and real-time presence indicators.",
            status: "in_progress",
            tag: "Feature",
          },
          {
            title: "Reduce P95 API latency",
            description:
              "Bring P95 response time from 800ms to under 300ms through caching and query optimization.",
            status: "planned",
            tag: "Performance",
          },
        ],
      },
      {
        title: "Next Quarter",
        cards: [
          {
            title: "Mobile app (iOS)",
            description:
              "Build a native iOS companion app with push notifications and offline support.",
            status: "planned",
            tag: "Feature",
          },
          {
            title: "Enterprise SSO integration",
            description:
              "Support SAML and OIDC for enterprise customers. Required for 3 pending deals.",
            status: "planned",
            tag: "Enterprise",
          },
          {
            title: "Self-serve billing portal",
            description:
              "Let customers upgrade, downgrade, and manage invoices without contacting support.",
            status: "planned",
            tag: "Billing",
          },
        ],
      },
      {
        title: "Future",
        cards: [
          {
            title: "AI-powered insights",
            description:
              "Use ML to surface usage patterns, churn risks, and feature adoption recommendations.",
            status: "planned",
            tag: "Innovation",
          },
          {
            title: "Public API & webhooks",
            description:
              "Open a public REST API and webhook system for third-party integrations.",
            status: "planned",
            tag: "Platform",
          },
          {
            title: "Internationalization (i18n)",
            description:
              "Localize the product for Spanish, French, German, and Japanese markets.",
            status: "planned",
            tag: "Expansion",
          },
        ],
      },
    ],
  },
  {
    id: "bug-triage",
    name: "Bug Triage Board",
    description:
      "Prioritize and track bugs from report through resolution.",
    columns: [
      {
        title: "Reported",
        cards: [
          {
            title: "Login fails on Safari 17",
            description:
              "Users report a blank screen after OAuth redirect on Safari 17.2+. Affects ~8% of traffic.",
            status: "planned",
            tag: "Critical",
          },
          {
            title: "CSV export missing columns",
            description:
              "Export omits the 'created_at' and 'tags' fields. Reported by 3 enterprise customers.",
            status: "planned",
            tag: "Medium",
          },
        ],
      },
      {
        title: "Investigating",
        cards: [
          {
            title: "Memory leak in dashboard",
            description:
              "Dashboard page memory usage grows to 500MB+ after 30 minutes. Likely a subscription cleanup issue.",
            status: "in_progress",
            tag: "Critical",
          },
        ],
      },
      {
        title: "Fix in Progress",
        cards: [
          {
            title: "Notification emails sent twice",
            description:
              "Duplicate webhook triggers causing double email delivery. Fix: add idempotency key.",
            status: "in_progress",
            tag: "Medium",
          },
        ],
      },
      {
        title: "Resolved",
        cards: [
          {
            title: "Dark mode text contrast",
            description:
              "Fixed insufficient contrast ratios on secondary text in dark mode. Now meets WCAG AA.",
            status: "done",
            tag: "Low",
          },
        ],
      },
    ],
  },
];
