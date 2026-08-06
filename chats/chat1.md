# D-GEM Event Platform Design

_Started 2026-08-06 16:59 UTC_

---

## User

Wireframe the screens for An Event/Movement platform called D-GEM I have attached the Logo. Now, I want you to design this professionally with Black, white and gold as the official colours for now.  Now, the website will have details of the Event, Mission and Vision statements, About the movement etc. It will have a section that introduces the guest speakers, their images and biography included. There'd be a "register now" CTA that will redirect to the registration page with the registration form. there would be an admin page/dashboard where the admin can upload all the necessary details like Guest speakers pictures, names and biography. When students or people register, they will get an invitation/qr code that would be sent to their emails that they must present at the event gate to be scanned. This means that there would be a door scanner design/page where the qr  codes would be scanned to grant access.
There'd also be sessions for the Convaner, Sponsors and the likes on the main page that will be uploaded and updated from the admin dashboard too. Also a session/page to register as volunteers. If there are things you feel I missed and should be added or are important, please add them.

## User

Wireframe the screens for An Event/Movement platform called D-GEM I have attached the Logo. Now, I want you to design this professionally with Black, white and gold as the official colours for now.  Now, the website will have details of the Event, Mission and Vision statements, About the movement etc. It will have a section that introduces the guest speakers, their images and biography included. There'd be a "register now" CTA that will redirect to the registration page with the registration form. there would be an admin page/dashboard where the admin can upload all the necessary details like Guest speakers pictures, names and biography. When students or people register, they will get an invitation/qr code that would be sent to their emails that they must present at the event gate to be scanned. This means that there would be a door scanner design/page where the qr  codes would be scanned to grant access.
There'd also be sessions for the Convaner, Sponsors and the likes on the main page that will be uploaded and updated from the admin dashboard too. Also a session/page to register as volunteers. If there are things you feel I missed and should be added or are important, please add them.

## User

Questions answered:
- event_context: Name: Don't Graduate Empty Movement Conference 1.0
Date: In November, don't know the date yet, admin should be able to edit every/all these details in the admin dashboard.
Venue: Olabisi Onabanjo University.
One Day conferecnce.
University Students are attending.
Roughly 500+
- audience: University students, Recent graduates
- platform: Both desktop + mobile for key screens
- scanner_device: Phone held by a steward
- screens: Landing/home, Registration form, Speakers list + speaker detail, Ticket/QR confirmation + email, Volunteer signup, Admin dashboard (overview), Admin: manage speakers, Admin: manage sponsors/convener, Admin: attendee list & check-in stats, Door scanner, Agenda/schedule, FAQ + contact, Sponsorship enquiry page
- reg_fields: Name, email, phone number, school/university, level/year, department. The event is free.
- ticket_types: One general ticket
- variations: Landing page structure & hero, Speaker section layout, Registration flow (one page vs steps), Scanner screen states, Admin dashboard layout
- tone: Aspirational & motivational
- content_ready: Use placeholder text for now, will change it in the admin dashboard when building
- volunteer_roles: Registration desk, ushering/protocol, media, content-creation/creators, idealists. 
- extras: Countdown to event day, Attendee dashboard (view/re-download ticket), Post-event feedback form, Email/SMS reminder templates, Sponsor tier showcase (Gold/Silver/Bronze)

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

Wireframed 21 screens as one canvas, black/white/gold, low-fi.

Variations where you asked: landing 1a/1b/1c, speakers 1d/1e, registration 1g/1h, admin dashboard 1l/1m, scanner states 1k. Plus everything else — speaker detail, ticket + email template, attendee dashboard, volunteer signup with your five roles, admin manage-speakers / sponsors-convener / attendees, agenda, sponsorship tiers, FAQ + feedback, and mobile versions of the three key screens (1u).

Things I added that you didn't list: event details fully editable in admin (date/venue/capacity/registration open-closed), a "needs attention" panel, gate-override and manual-search states on the scanner, and crew QR badges for accepted volunteers.

Reference any id in chat (e.g. "build out 1b") to go deeper.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Fixed — nav now wraps instead of clipping the CTA.

## User

this is the logo.

## Assistant

Got it — logo noted (purple/gold mark, "Don't Graduate Empty" wordmark). Since you set the palette to black/white/gold for the site itself, want me to drop this actual logo image into the wireframe's mark placeholders now, or keep it as a placeholder until we move past wireframes?

## User

I don't really like the UI, the buttons look ugly. Link arrangents are bad too.

## Assistant

_[tool: dc_html_str_replace]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Buttons now solid black with a gold arrow (gold-on-black flips for dark sections so they stay visible), and nav links got even spacing instead of cramped inline text.

