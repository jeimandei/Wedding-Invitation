# Security notes for this deployment

This site was built for one wedding and is superseded by
[baundang.id](https://baundang.id). It is kept here as the design origin of that
platform's `SIGNATURE` template. Anyone reading or reviving this code should know what
its access controls do and do not do, because from the outside several of them look
stronger than they are.

None of what follows is a newly introduced weakness. It is what the design has always
done, written down.

---

## 1. Guest invite codes can be forged from a name alone

A guest's id is the first 16 hex characters of `SHA-256(name.trim().toLowerCase() + SALT)`.
The same value is the invite link (`?to=<id>`) **and** the entrance scan code — the
README says so, and that is the appeal of the scheme: one value, no separate QR to
manage.

The salt is `ShadowRubyAsh120122`, and it appears in client-side JavaScript in
`js/script.js` and `gifts.html` as well as server-side in `apps-script.js`.

So anyone who knows a guest's name can compute that guest's id, open their invite, and
produce a scan code the door will accept.

**This is not fixable by moving the salt somewhere less obvious.** `index.html` accepts
`?to=Name` and derives the id in the browser, and `gifts.html` derives one for a
walk-in the same way. The client has to be able to do the hash, so the salt has to
reach the client, so the salt is public. Obscuring it would hide the problem from a
reader of the source without changing what an attacker can do.

The durable fix is the one baundang.id already implements: the server issues a random
code that is not derived from anything guessable, and the guest's name is a property of
that code rather than its input.

## 2. The PIN gates on `welcome.html`, `guestbook.html`, `gifts.html` and `admin.html`
   protect nothing

Two independent reasons, either sufficient:

- The comparison happens **in the browser**, against unsalted SHA-1/SHA-256/SHA-512
  digests of a short PIN that are shipped in the page. A short numeric PIN falls to a
  dictionary of every candidate in well under a second. Computing three different
  digests does not make this harder — it is one guess checked three ways, not three
  guesses.
- Even with no PIN at all, the pages hold no data of their own. Everything they show is
  read from the spreadsheet in point 3, which is world-readable. Skipping the gate
  entirely and reading the sheet gets the same information.

## 3. The spreadsheet is public, and that is required

`README.md` instructs sharing the sheet as *"Anyone with the link → Viewer"*, because
the public `gviz` endpoint the pages read from will not work otherwise. The sheet id is
published in the README and in four HTML files.

That means guest names, phone numbers, table assignments, RSVP messages, scan times and
gift records are readable by anyone who has the URL — which is anyone who has viewed
the site's source.

## 4. The Apps Script endpoint is unauthenticated

`README.md` deploys it as *"Who has access: Anyone"*, and the deployment URL is in the
same four HTML files. Anything the script will do on request, it will do for anyone
who asks.

---

## What to actually do

**If the deployment is finished with** — which it is, if baundang.id has taken over —
then the complete remedy is two actions in Google, neither of them in this repository:

1. **Delete the Apps Script deployment.** Extensions → Apps Script → Deployments →
   Archive. This ends points 1 (writes), 2 and 4.
2. **Unshare the spreadsheet.** Set link sharing to Restricted. This ends point 3.

After that the committed salt, sheet id and script URL name nothing that exists, and
they can stay in the history without consequence.

**If it stays live**, rotate the salt, redeploy the script to get a fresh URL, move to a
new spreadsheet and change the PINs. Be clear-eyed about what that buys, though: each
new value goes straight back into client-side JavaScript, so the rotation restores
secrecy for exactly as long as it takes someone to open the page source again. It
closes off whoever has the current values. It does not make the design sound.

Rewriting the git history to purge the values is not worth doing on its own. It does
not un-publish a salt that the running site hands to every visitor, and the two Google
actions above are what actually revoke access.
