# Eng Lexicon

A growing glossary of design engineering concepts, explained simply. No jargon. Real examples. Built by Danny as he learns — and shared publicly to help other designers cross into code.

---

### Markdown (.md)
A simple way to write formatted text using plain characters. Instead of clicking "Bold" in a toolbar, you type `**bold**`. Instead of creating a heading in a rich text editor, you type `# Heading`. Most README files, docs, and blogs use it. This file you're reading right now is written in Markdown.

**Example:**
```md
# My Title
This is a paragraph with **bold** and *italic* text.
- A bullet point
- Another one
```

---

### MDX (.mdx)
Markdown, but with superpowers. It lets you mix regular Markdown text with interactive React components. Imagine writing a blog post in Markdown, but being able to drop in a live interactive chart, a button, or a custom widget right in the middle of your text.

**Example:**
```mdx
# My Blog Post

Here's some normal text.

<CoffeeTracker beans={12} />

And the post continues below the interactive component.
```

Regular `.md` files can only show static text and images. `.mdx` files can show anything a web app can show.

---

### Query
A request to **read** data. When your app loads a grocery list from the database, that's a query. It doesn't change anything — it just asks "what's there?" and gets an answer.

**Example in Casita:**
```ts
// "Give me all the groceries"
const groceries = useQuery(api.groceries.list);
```

---

### Mutation
A request to **change** data. Adding an item to the grocery list, checking it off, deleting it — those are all mutations. If a query is reading a book, a mutation is writing in it.

**Example in Casita:**
```ts
// "Add eggs to the grocery list"
addItem({ name: "Eggs", addedBy: "Danny" });
```

---

### API (Application Programming Interface)
A way for two pieces of software to talk to each other. When Casita asks Convex "give me the grocery list," it's using an API. When your phone asks Google "what's the weather," it's using an API. Think of it as a menu at a restaurant — it tells you what you can order (request) and what you'll get back (response).

---

### CSS Variables (Custom Properties)
Named values you define once and reuse everywhere in your styles. Instead of typing `#171717` in 50 places, you define `--gray-900: #171717` once, then use `var(--gray-900)` everywhere. If you decide to change the color later, you change it in one place and it updates everywhere.

**Example from Casita:**
```css
:root {
  --content-primary: #171717;
}

/* Used like this: */
h1 {
  color: var(--content-primary);
}
```

---

### PWA (Progressive Web App)
A website that can behave like a native app on your phone. You can "install" it to your home screen, it works offline (if built for it), and it feels like a real app — but it's just a website under the hood. No App Store needed.

---

### Real-time Sync
When data updates instantly across all connected devices without anyone pressing refresh. In Casita, if Cami adds "milk" to the grocery list on her phone, Danny sees it appear on his screen immediately. The app is always listening for changes.

---

### Schema
The blueprint for your database. It defines what kind of data you're storing and what shape it takes. Like a spreadsheet template — before you fill in rows, you define the columns (name, date, price, etc.).

**Example from Casita:**
```ts
// The grocery table has these columns:
groceries: {
  name: string,        // "Eggs"
  checked: boolean,    // true or false
  addedBy: string,     // "Danny"
  createdAt: number,   // timestamp
}
```

---

### Component
A reusable building block of a user interface. A button is a component. A grocery list item is a component. A whole sidebar can be a component. You build them once, then use them anywhere — like Figma components, but in code.

**Example:**
```tsx
// This is a component
function GroceryItem({ name }) {
  return <li>{name}</li>;
}

// Used like this:
<GroceryItem name="Eggs" />
<GroceryItem name="Milk" />
<GroceryItem name="Bread" />
```

---

### State
Data that can change over time in your app. The text you're typing in an input field — that's state. Whether a checkbox is checked or not — that's state. When state changes, the screen updates automatically to reflect it.

**Example:**
```ts
const [newItem, setNewItem] = useState("");
// newItem starts as "" (empty)
// When you type "Eggs", setNewItem("Eggs") updates the state
// The input field shows "Eggs" because the state changed
```

---

### TypeScript
JavaScript, but with guardrails. Regular JavaScript lets you do anything — even things that will break. TypeScript adds a layer that checks your work as you write, catching mistakes before the app runs. It's like spell-check, but for code.

**Example:**
```ts
// JavaScript: no complaints, but will break at runtime
let price = "ten"; // oops, should be a number
let total = price * 2; // NaN (not a number) — silent failure

// TypeScript: catches it immediately
let price: number = "ten"; // ❌ Error: "ten" is not a number
```

---

### Tailwind CSS
A way to style your app by adding small utility classes directly to your HTML instead of writing separate CSS files. Instead of creating a `.button` class and defining its styles elsewhere, you write the styles inline using short class names.

**Example:**
```html
<!-- Traditional CSS: define styles somewhere else -->
<button class="primary-button">Click me</button>

<!-- Tailwind: styles are right there -->
<button class="bg-black text-white px-4 py-2 rounded-lg">Click me</button>
```

`bg-black` = black background. `text-white` = white text. `px-4` = horizontal padding. `rounded-lg` = rounded corners. You read it and know exactly what it looks like.

---

### Git
A system that tracks every change you make to your code, like version history in Google Docs but way more powerful. You can go back to any previous version, see exactly what changed and when, and work on different features in parallel without breaking things. Every serious software project uses it.

---

### Repository (Repo)
A folder for your project that Git tracks. It contains all your code, the full history of changes, and can live on GitHub so others (or other devices) can access it. Casita's repo is at `github.com/danielchungf/casita`.

---

### Webhook
A way for one app to automatically notify another app when something happens. Instead of your app constantly asking "did anything change? did anything change?" (that's called polling), the other app sends you a message the moment something happens. Like signing up for a package delivery notification — you don't keep checking the door, UPS texts you when it arrives.

**Example:**
```
// Without webhook: your app keeps asking Stripe every 5 seconds
"Did anyone pay yet?" → "No"
"Did anyone pay yet?" → "No"
"Did anyone pay yet?" → "Yes!"

// With webhook: Stripe tells you the moment it happens
Stripe → YOUR APP: "Hey, someone just paid $49. Here's the details."
```

In practice, you give the other service a URL on your server, and they send data to that URL when an event occurs.

---

### Breadcrumbs
A navigation pattern that shows where you are in an app's hierarchy, like a trail of pages you followed to get here. Named after Hansel and Gretel — they dropped breadcrumbs to find their way back. In a UI, it usually looks like a row of clickable links separated by arrows or slashes.

**Example:**
```
Home > Settings > Account > Change Password
```

Each step is clickable, so you can jump back to any level without hitting the back button repeatedly. You see these on Amazon (Home › Electronics › Headphones), file explorers, and most apps with nested pages.

---

### Database
A structured place where your app stores data permanently. Without a database, everything your app knows disappears when you close it — like writing on a whiteboard that gets erased every night. A database is the filing cabinet that keeps it all. You can add data, read it back, update it, and delete it.

Convex (what Casita uses), Supabase, Firebase, and PostgreSQL are all databases — they just work differently under the hood. Some store data in tables like spreadsheets (SQL databases like Supabase/PostgreSQL), others store data more flexibly as documents (like Convex and Firebase).

**Example from Casita:**
```ts
// Writing to the database — storing a grocery item
await ctx.db.insert("groceries", {
  name: "Eggs",          // the data you're saving
  checked: false,
  addedBy: "Danny",
  createdAt: Date.now(),
});

// Reading from the database — getting all grocery items back
const items = await ctx.db.query("groceries").collect();
```

**Compare:** Convex and Supabase are both databases, but Convex handles real-time sync automatically (changes appear instantly on all devices), while Supabase requires you to wire that up yourself.

---

### React
A JavaScript library for building user interfaces. Instead of writing HTML by hand and manually updating the screen when data changes, React lets you describe what the screen should look like for any given data — and it handles updating the screen for you. It's the most popular way to build web app interfaces today.

The key idea: you build small, reusable **components** (buttons, lists, cards) and compose them together like LEGO blocks. When data changes (like a new item added to a grocery list), React automatically figures out what part of the screen needs to update and only changes that part.

**Example from Casita:**
```tsx
// A React component — describes what a grocery item looks like
function GroceryItem({ name, checked }) {
  return (
    <li>
      <input type="checkbox" checked={checked} />  {/* a checkbox */}
      <span>{name}</span>                           {/* the item name */}
    </li>
  );
}

// React renders one of these for each item in your list
<GroceryItem name="Eggs" checked={false} />
<GroceryItem name="Milk" checked={true} />
```

**Compare:** React builds the interface. Convex stores the data. Tailwind styles the look. They're three different layers working together.

---

### Next.js
A framework built on top of React that adds everything you need to build a full website — routing (different pages at different URLs), server-side rendering (pages load fast because the server does work upfront), and deployment tools. If React is the engine, Next.js is the car — it gives you the steering wheel, seats, and wheels so you can actually drive.

Without Next.js, you'd have to set up routing, page loading, image optimization, and a bunch of other stuff yourself. Next.js gives you all of that out of the box.

**Example:**
```
casita/src/app/
├── page.tsx          → shows at casita.com/
├── groceries/
│   └── page.tsx      → shows at casita.com/groceries
├── chores/
│   └── page.tsx      → shows at casita.com/chores
└── layout.tsx        → wraps every page (shared header, footer, etc.)
```

Just by creating a file in the right folder, Next.js automatically creates a page at that URL. No configuration needed. This is called **file-based routing**.

**Compare:** React is the library for building UI. Next.js is the framework that turns React into a complete website with pages, URLs, and performance optimizations. All your projects (Casita, SipSip, Garden) use Next.js.

---

### Predictive AI
AI that looks at existing data and makes educated guesses about what will happen next. It finds patterns in past behavior and uses them to forecast outcomes. If generative AI (like Claude) *creates* new content, predictive AI *anticipates* what's coming. Think of it like a weather forecast — it looks at historical weather patterns and tells you it'll probably rain tomorrow.

**Example:**
```
// Generative AI: "Write me a product description"
→ Creates something new from scratch

// Predictive AI: "Which users are likely to cancel their subscription?"
→ Analyzes past behavior patterns to flag at-risk users

// Predictive AI in Dex's context:
→ "Based on this child's learning patterns, they'll be ready for harder vocabulary next week"
```

**Compare:** Generative AI creates new things (text, images, code). Predictive AI forecasts outcomes from existing data. Many products combine both.

---

### Data Structuring
The process of taking messy, unorganized information and putting it into a clean, consistent format that software can work with. Like taking a pile of receipts thrown in a shoebox and organizing them into a spreadsheet with columns for date, amount, and category. Raw data is useless until it's structured — then you can search it, sort it, analyze it, and build features on top of it.

**Example:**
```
// Unstructured: a messy pile of info
"Danny had eggs and toast for breakfast on March 10, spent $4.50"

// Structured: clean, organized, usable
{
  date: "2026-03-10",
  meal: "breakfast",
  items: ["eggs", "toast"],
  cost: 4.50
}
```

When someone says "predictive AI + data structuring," they usually mean: organize the messy data first, then run predictions on it. You can't predict patterns if the data is a mess.

---

### Fuzzy Match
A search that finds results even when the input isn't an exact match. Instead of requiring you to type "basketball" perfectly, a fuzzy match would still find it if you typed "basktball" or "basket." It measures how *close* two strings are, not whether they're identical. Most search bars you've used do this — Google doesn't break when you misspell something.

**Example:**
```
// Exact match: only finds "tennis"
search("tenis") → ❌ no results

// Fuzzy match: close enough, still finds it
search("tenis") → ✅ "tennis" (1 letter off)
search("tenns") → ✅ "tennis" (close enough)
search("xyz")   → ❌ no results (too far off)
```

In Brett's context: Twinsi's search does a basic fuzzy match on sport names — so if a user types "basktball" it still finds "basketball." Adding tags would give the search more data to match against, making results better.

**Compare:** Exact match = must be identical. Fuzzy match = close enough counts. Most modern search UIs use fuzzy matching so users don't have to be perfect typists.

---

### Hotfix
A quick, targeted code fix that gets deployed directly to the live app to solve an urgent bug — outside the normal release cycle. Think of it like an emergency plumber visit: you don't wait for your scheduled home maintenance, you call someone NOW because the pipe is leaking. Hotfixes skip the usual process (testing rounds, staging, App Store review) and go straight to production because the bug is hurting real users right now.

**Example:**
```
// Normal release cycle:
Code change → Tests → Staging → QA → App Store review → Production
(days to weeks)

// Hotfix:
Bug found in production → Fix written → Quick test → Deploy to production
(hours)

// From Twinsi: Brett found a bug where the streak counter
// returned 1 even when no weeks met the goal.
// He pushed a hotfix (PR #248) directly to prod that night.
```

**Compare:** A regular release bundles many changes and goes through the full pipeline. A hotfix is a single urgent fix deployed fast. You don't want to hotfix often — it means something slipped through.

---

### Staging vs Production
Two separate environments where your app runs. **Production** (or "prod") is the live version that real users see and use — it's the real deal. **Staging** is a copy of the app that only the team can access, used to test new features before they go live. Think of staging as a dress rehearsal and production as opening night.

**Example:**
```
// Staging: only the team sees this
https://staging.twinsi.app
→ New features being tested
→ Fake/test data
→ Safe to break things

// Production: real users, real data
https://twinsi.app
→ Live app in the App Store
→ Real user workouts and achievements
→ Breaking things here = bad

// From Twinsi: Pierre thought the celebration cards
// were being tested in staging, but Franck confirmed
// it was prod — real users were seeing them.
```

**Compare:** Staging is your sandbox — test freely, break things, nobody cares. Production is the stage — real audience, real consequences. Always know which one you're looking at.

---

### Deploy (to Prod)
The act of taking your code changes and pushing them to the live production environment so real users get the update. It's the moment your work goes from "on my computer" to "in everyone's hands." Deploying to prod is a one-way door — once it's out there, users are using it. That's why teams usually ask for approval before deploying, especially for hotfixes.

**Example:**
```
// The deployment flow:
1. Write code on your computer
2. Push to GitHub (code is stored, not live yet)
3. Deploy to staging (team can test it)
4. Deploy to prod (real users get it)  ← this is "deploying to prod"

// From Twinsi: Brett asked the team before deploying:
// "Ok if I deploy this hotfix to prod?"
// Franck replied: "awesome. yes plz"
// Brett confirmed: "It is up ✅"
```

**Compare:** Pushing to GitHub stores your code. Deploying to prod makes it live. They're different steps — you can push code without deploying it.

---

*The Eng Lexicon grows as Danny learns. Each entry comes from a real moment — a project, a question, a conversation. It's a record of becoming a design engineer.*
