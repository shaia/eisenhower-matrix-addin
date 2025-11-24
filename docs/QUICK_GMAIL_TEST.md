# Quick Gmail Testing - 5 Minutes ⚡

## Files You Need

From your project:
- `gmail/addon.js` → Copy to Code.gs
- `gmail/matrix.html` → Copy to gmail-matrix.html
- `gmail/appsscript.json` → Copy to appsscript.json

---

## Quick Setup (5 steps)

1. **Go to [script.google.com](https://script.google.com)**

2. **New Project** → Name it "Eisenhower Matrix"

3. **Add Files:**
   - Code.gs: Paste content from `gmail/addon.js`
   - + HTML: Create "gmail-matrix", paste from `gmail/matrix.html`
   - Settings ⚙️: Check "Show manifest file", then edit appsscript.json (paste from `gmail/appsscript.json`)

4. **Deploy → Test deployments → Install**
   - Grant permissions

5. **Open [Gmail](https://mail.google.com) → Open email → Check sidebar**

---

## What to Test

✅ **Card shows:**
- Email subject & sender
- 4 quadrant buttons
- "Open Full Matrix View" button

✅ **Click button:**
- Notification appears
- Email added to quadrant

✅ **Open full matrix:**
- Overlay opens
- All 4 quadrants visible
- Can add/remove items
- Statistics update

---

## Success = All Green ✅

- [ ] Icon appears in Gmail sidebar
- [ ] Can click quadrant buttons
- [ ] Notification shows "Added to..."
- [ ] Full matrix view opens
- [ ] Items persist after refresh

---

## Quick Debug

**Icon not showing?**
- Refresh Gmail (Ctrl+R)
- Check Apps Script deployment is active

**Errors?**
- Apps Script: View → Execution log
- Gmail: F12 → Console tab

**Data not saving?**
- Check permissions granted
- Test: Run `getMatrixData()` in Apps Script

---

## Files Checklist

In Apps Script, you should have:
```
✅ Code.gs (~370 lines)
✅ gmail-matrix.html (~380 lines)
✅ appsscript.json (~40 lines)
```

**Note:** appsscript.json appears only after enabling "Show manifest file" in Settings ⚙️. You cannot upload JSON files directly to Apps Script.

---

**That's it! Start testing! 🚀**

Full guide: See [GMAIL_TESTING_STEPS.md](GMAIL_TESTING_STEPS.md)
