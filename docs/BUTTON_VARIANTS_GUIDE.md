🔒 FINAL BUTTON SYSTEM — HomieBites (LOCKED)

If a button does not fit into one of these 5 categories, it is a bug.

✅ ALLOWED BUTTON TYPES (ONLY THESE)
Type Class Purpose
Primary .btn-primary Main CTA
Secondary .btn-secondary Alternate CTA
Ghost .btn-ghost Low-priority actions
Public .btn-public Marketing / public pages
Special .btn-special Contextual (danger, WhatsApp, promo, admin)

❌ Removed permanently:

btn-outline

btn-text

btn-whatsapp

btn-danger

btn-add-item

btn-view-details

btn-edit-order

btn-remove

Admin-specific duplicates

They now map to Special.

🧱 BASE BUTTON RULES (NON-NEGOTIABLE)

All buttons must use .btn.

Global behavior

Skewed design stays

Counter-skew content stays

One animation system

One focus style

One disabled style

.btn {
display: inline-flex;
align-items: center;
justify-content: center;
gap: var(--space-2);

padding: 0.75rem 1.5rem;
font-size: 0.95rem;
font-weight: 600;

border-radius: 0;
border: 2px solid transparent;

transform: skewX(-8deg);
cursor: pointer;
text-decoration: none;
white-space: nowrap;

transition:
background-color 0.25s ease,
color 0.25s ease,
border-color 0.25s ease,
box-shadow 0.25s ease,
transform 0.15s ease;
}

.btn > \* {
transform: skewX(8deg);
}

.btn:hover {
transform: skewX(-8deg) translateY(-1px);
}

.btn:focus-visible {
outline: 3px solid currentColor;
outline-offset: 3px;
}

.btn:disabled,
.btn[aria-disabled="true"] {
opacity: 0.55;
cursor: not-allowed;
pointer-events: none;
}

🟢 1. PRIMARY BUTTON

Green → Orange (fade)
White text always

.btn-primary {
background-color: var(--primary-green);
color: #fff;
}

.btn-primary:hover {
background-color: var(--primary-orange);
}

Use for

Order Now

Submit

Save

Confirm

🟠 2. SECONDARY BUTTON

Orange → Green (fade)
White text always

.btn-secondary {
background-color: var(--primary-orange);
color: #fff;
}

.btn-secondary:hover {
background-color: var(--primary-green);
}

Use for

View

Edit

Learn More

Back

👻 3. GHOST BUTTON

Transparent
Orange text + border
Hover → Green text + border
NO filled background

.btn-ghost {
background-color: transparent;
color: var(--primary-orange);
border-color: var(--primary-orange);
}

.btn-ghost:hover {
color: var(--primary-green);
border-color: var(--primary-green);
}

Use for

Cancel

Skip

Close

Secondary inline actions

🌍 4. PUBLIC BUTTON

Theme-neutral, safe, boring by design.

.btn-public {
background-color: var(--neutral-200);
color: var(--neutral-900);
}

.btn-public:hover {
background-color: var(--neutral-300);
}

Use for

Landing pages

Blogs

Marketing sections

⭐ 5. SPECIAL BUTTON (THE ONLY EXTENSION POINT)

Everything “special” goes here via variables.

.btn-special {
background-color: var(--btn-bg);
color: var(--btn-text, #fff);
border-color: var(--btn-border, transparent);
}

.btn-special:hover {
background-color: var(--btn-bg-hover);
}

Examples (DO NOT CREATE NEW CLASSES)
/_ WhatsApp _/
.btn-special.whatsapp {
--btn-bg: #25d366;
--btn-bg-hover: #20ba5a;
}

/_ Danger _/
.btn-special.danger {
--btn-bg: #ef4444;
--btn-bg-hover: #dc2626;
}

/_ Admin Accent _/
.btn-special.admin {
--btn-bg: var(--primary-green);
--btn-bg-hover: var(--primary-orange);
}

📏 SIZE MODIFIERS (SAFE TO KEEP)
.btn-small {
padding: 0.5rem 1rem;
font-size: 0.85rem;
}

.btn-large {
padding: 1rem 2.5rem;
font-size: 1.1rem;
}

.btn-full {
width: 100%;
}

🧠 MAPPING (IMPORTANT — READ THIS)
Old Button New Button
btn-outline btn-ghost
btn-text btn-ghost
btn-whatsapp btn-special.whatsapp
btn-danger btn-special.danger
btn-add-item btn-primary
btn-edit-order btn-secondary
btn-view-details btn-secondary
❌ HARD RULES (ENFORCE IN CODE REVIEW)

No new button classes

No admin-only button variants

No color overrides

No inline styles

No duplicated semantics

If it’s not one of the 5 → reject PR
