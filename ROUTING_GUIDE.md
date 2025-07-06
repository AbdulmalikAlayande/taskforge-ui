# Multi-Tenant Routing Guide

This guide explains how the multi-tenant routing works in your Next.js application.

## Overview

Your application uses Next.js App Router with dynamic routing to support multiple tenants. Each tenant gets their own URL space: `/{tenant-slug}/...`

## File Structure

```
src/app/
├── (dashboard)/           # Route group (doesn't affect URL)
│   └── [tenant]/         # Dynamic route for tenant slug
│       ├── layout.tsx    # Tenant-specific layout with validation
│       ├── projects/
│       │   └── page.tsx  # /{tenant}/projects
│       ├── tasks/
│       │   └── page.tsx  # /{tenant}/tasks
│       ├── inbox/
│       │   └── page.tsx  # /{tenant}/inbox
│       └── insights/
│           └── page.tsx  # /{tenant}/insights
├── onboarding/
│   └── organization/
│       └── page.tsx      # Organization creation
└── api/
    └── tenant/
        └── [tenant]/
            ├── route.ts     # GET tenant data
            └── validate/
                └── route.ts # Validate tenant access
```

## How It Works

### 1. Route Groups: `(dashboard)`

- Route groups organize files without affecting the URL
- `(dashboard)` folder doesn't appear in the URL path
- Allows you to group related routes and apply shared layouts

### 2. Dynamic Routes: `[tenant]`

- Creates a dynamic route segment that captures the tenant slug
- Accessible via `params.tenant` in layouts and pages
- Examples:
  - `/acme/projects` → `params.tenant = "acme"`
  - `/startup-inc/tasks` → `params.tenant = "startup-inc"`

### 3. Layouts

- `layout.tsx` in `[tenant]` folder wraps all tenant routes
- Validates user access to the tenant
- Provides tenant context to child components
- Shows loading state during validation

## Key Components

### TenantProvider (`src/components/tenant-provider.tsx`)

```tsx
// Provides tenant context throughout the dashboard
const { tenantId, tenantData, isLoading } = useTenant();
```

### TenantLink (`src/components/tenant-link.tsx`)

```tsx
// Automatically prefixes tenant ID to links
<TenantLink href="/projects">Projects</TenantLink>
// Renders as: /{current-tenant}/projects
```

### useTenantNavigation (`src/hooks/useTenantNavigation.ts`)

```tsx
// Programmatic navigation within tenant
const { navigateToProjects, navigateToTasks } = useTenantNavigation();
```

## Usage Examples

### 1. Creating a New Tenant Route

```tsx
// src/app/(dashboard)/[tenant]/settings/page.tsx
"use client";

import { useTenant } from "@src/components/tenant-provider";

export default function Settings() {
	const { tenantData, isLoading } = useTenant();

	if (isLoading) return <div>Loading...</div>;

	return (
		<div>
			<h1>Settings for {tenantData?.name}</h1>
		</div>
	);
}
```

### 2. Navigation Between Tenant Routes

```tsx
import { TenantLink } from "@src/components/tenant-link";

// Declarative navigation
<TenantLink href="/settings">Settings</TenantLink>;

// Programmatic navigation
import { useTenantNavigation } from "@src/hooks/useTenantNavigation";

const { navigateToTenantRoute } = useTenantNavigation();
navigateToTenantRoute("settings");
```

### 3. Redirecting After Organization Creation

```tsx
// In organization onboarding
const organizationSlug = response.data.slug;
router.push(`/${organizationSlug}/projects`);
```

## API Routes

### Tenant Validation: `/api/tenant/[tenant]/validate`

- Validates if user has access to the tenant
- Called by tenant layout before rendering
- Returns 403 if access denied

### Tenant Data: `/api/tenant/[tenant]`

- Fetches tenant information
- Used by TenantProvider to populate context
- Returns tenant details for the dashboard

## Security & Access Control

1. **Layout-Level Validation**: Every tenant route goes through the layout validation
2. **API-Level Checks**: API routes verify tenant access on each request
3. **Context-Aware Components**: Components use tenant context to ensure data belongs to the current tenant

## Common Patterns

### 1. Tenant-Aware Data Fetching

```tsx
const { tenantId } = useTenant();

useEffect(() => {
	fetch(`/api/tenant/${tenantId}/projects`)
		.then((res) => res.json())
		.then(setProjects);
}, [tenantId]);
```

### 2. Conditional Rendering Based on Tenant

```tsx
const { tenantData } = useTenant();

return <div>{tenantData?.name && <h1>Welcome to {tenantData.name}</h1>}</div>;
```

### 3. Multi-Tenant Form Submissions

```tsx
const { tenantId } = useTenant();

const handleSubmit = async (data) => {
	await fetch(`/api/tenant/${tenantId}/projects`, {
		method: "POST",
		body: JSON.stringify(data),
	});
};
```

## Best Practices

1. **Always use tenant context**: Don't hardcode tenant IDs
2. **Validate access**: Check permissions at both layout and API levels
3. **Use TenantLink**: For consistent tenant-aware navigation
4. **Handle loading states**: Show appropriate loading UI during tenant validation
5. **Error boundaries**: Implement error handling for invalid tenant access

## Troubleshooting

### Common Issues:

1. **"Tenant not found" errors**: Check if the tenant slug exists in your database
2. **Access denied**: Verify user membership in the organization
3. **Layout not rendering**: Ensure all required providers are set up
4. **Navigation issues**: Use tenant-aware navigation hooks and components

This multi-tenant architecture provides a scalable foundation for your application while maintaining security and user experience.
