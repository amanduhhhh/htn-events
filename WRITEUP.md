# Writeup!!

## Development Process

### Planning and Structure

I started by breaking down the requirements into core components: an events list, authentication system, and event details view. I opted for a modal-based approach for event details rather than separate pages because it felt more natural for browsing multiple events quickly. The hash-based navigation lets users share direct links to events while keeping the modal UX.

For the overall structure, I organized events by date with time-based sorting within each day. I considered a calendar/schedule view (which most hackathons use), but decided against it. Calendar views are rigid and struggle with edge cases like multiple overlapping events, events spanning different time zones, or events that might appear across different years. The list-based approach with date headers is more flexible and scales better when you don't control the data structure (with the downside of being a little less grpahically intuitive and not as cool).

### Tech Stack Decisions

I went with Next.js 16 with the App Router because it handles routing, API proxying, and server components cleanly. The CORS issue with the events API was solved by creating a Next.js API route that proxies requests server-side.

For UI components, I used shadcn/ui with Radix UI primitives. I've found that trying to build accessible components from scratch usually results in missing edge cases, so starting with tested primitives saved time and improved accessibility. Tailwind CSS made it easy to stay consistent with spacing and responsive breakpoints.

TypeScript was non-negotiable for a project like this. Having the event schema typed caught several bugs early, especially around optional fields like `public_url` and `permission`.

### Design Approach

I copied the color scheme + font directly from Hack the North 2022. That year had my favorite design aesthetic from HTN, and I have a lot of respect for their design team and how they handle theming. The pink, green, and blue palette felt energetic without being overwhelming, and the dark background keeps it modern.

I mapped event types to specific colors (workshops to pink, tech talks to green, activities to orange) to make scanning the list easier. The colouring is hardcoded to the known event types, but the list is easily updated in one place, as I wanted to prioritize designer intent over random colour coding.

### Mobile Responsiveness

I paid close attention to mobile since most people would probably check the schedule on their phones. The modal scales to fullscreen on mobile with no rounded corners so it feels like a native page transition. The login button collapses to just an icon on small screens to save space. Side margins are larger than typical to prevent text from feeling cramped against the edges.

### Problems and Solutions

**CORS blocking the API**: The browser was blocking requests to the HTN API. I created a Next.js API route at `/api/events` that fetches server-side and returns the data. This also gives us a place to add caching or rate limiting later if needed.

**Authentication and private events**: I implemented localStorage-based auth with hardcoded credentials. The tricky part was making sure hash navigation respects permissions. If you're not logged in and try to access a private event via URL hash, it silently fails rather than showing an error. Related events in the modal are filtered based on auth status so you only see links to events you can access.

**Modal scroll behavior**: Getting the modal to feel right took iteration. The header stays fixed while content scrolls, and there's a solid section at the bottom that covers overflow content so you don't see text peeking through. This gives a clear visual indication that there's more to scroll.

### Performance and Scalability

**Caching**: The API route caches responses from the HTN API for 5 minutes server-side using Next.js `revalidate`, and sets `Cache-Control` headers with `stale-while-revalidate` so browsers and CDNs serve cached data while refreshing in the background. This means toggling login state doesn't hammer the upstream API, and deployed on Vercel the edge cache handles repeated requests efficiently.

**Infinite scroll pagination**: Events are loaded progressively using an `IntersectionObserver`. Only the first batch renders on page load, and more load automatically as you scroll down. This keeps the initial render fast and would scale to hundreds of events without loading them all into the DOM at once.

### Code I'm Proud Of

The hash-based navigation system lets you link directly to events (`/#3` opens event 3) while respecting authentication. It updates the URL when you click related events, so the back button works as expected. It's really simple and definitely not too impressive but I found it quite elegant. 


## Future Extensions

Given more time to turn this into a production app for thousands of users, I'd add:

### Features

**Search and filtering**: Let users search by event name, speaker, or description. Add filters for event type, and maybe a "favorites" system where users can bookmark events they want to attend.

**Better authentication**: Replace localStorage with proper JWT-based auth with a backend. Add password reset, session management, and maybe OAuth for easier login.

**Personalized schedule**: Let users build their own schedule by selecting events. Show conflicts when events overlap. Export to calendar apps (iCal format).

**Accessibility improvements**: Add keyboard navigation for the event grid, better screen reader support, and high contrast mode.

**Animations**: I would have spent more time on animations. Smooth transitions when opening modals, subtle hover effects on cards, and loading state animations would make it feel more polished. The login page especially could use some personality.

### Future Performance

**Image optimization**: If events had images, use Next.js Image component with proper sizing and lazy loading.

**Code splitting**: The modal component could be lazy-loaded since it's not needed on initial render.

**Analytics**: Track which events get the most views, how many people use search/filters, and where users drop off. This helps prioritize features.

**CDN**: Serve static assets through a CDN. The font files and any images should be edge-cached.

**Error boundaries**: Add React error boundaries to catch component failures gracefully instead of crashing the whole app.

**Monitoring**: Set up error tracking (Sentry) and performance monitoring (Vercel Analytics) to catch issues in production.

### Architecture

The current structure is pretty clean for a small app. Components are separated by concern (EventCard, EventModal, login page), and the API layer is isolated in `lib/api.ts`. If this grew, I'd consider:

- Moving authentication logic into a context provider instead of prop drilling
- Creating a custom hook for event filtering/sorting logic
- Adding a state management solution (Zustand or Jotai) if state gets complex
- Splitting the API layer to handle different endpoints separately

All API responses are typed, which makes refactoring safe. Adding more events or event types would be straightforward since the types are centralized.

## Additional Thoughts

The decision to avoid a calendar view was deliberate but might not suit everyone. Some users might prefer seeing events in a traditional calendar grid. If user research showed that was important, I'd add it as an optional view mode alongside the list view.

Overall, I tried to balance feature completeness with code quality. I'd rather ship something polished with fewer features than something feature-rich but buggy. The core requirements are all met, the code is maintainable, and it works well on mobile. That felt like the right scope for this challenge.
