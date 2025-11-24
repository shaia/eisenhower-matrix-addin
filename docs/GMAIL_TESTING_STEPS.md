# Gmail Add-on Testing Guide 🧪

## Prerequisites ✅

Before testing, make sure you have:
- [ ] Google account (any Gmail account)
- [ ] Access to [script.google.com](https://script.google.com)
- [ ] The Gmail add-on files ready

---

## Step-by-Step Testing Process

### Step 1: Create Apps Script Project

1. **Open Apps Script**
   - Go to [script.google.com](https://script.google.com)
   - Sign in with your Google account

2. **Create New Project**
   - Click **"New project"** (top left)
   - The editor will open with a blank `Code.gs` file

3. **Name Your Project**
   - Click "Untitled project" at the top
   - Rename to: **"Eisenhower Matrix Gmail"**
   - Click anywhere to save

---

### Step 2: Add the Code Files

#### 2.1: Add Server-Side Code

1. **Rename the default file**
   - The default file is called `Code.gs`
   - Click on "Code.gs" to select it

2. **Copy the server code**
   - Open your local file: `gmail/addon.js`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

3. **Paste into Apps Script**
   - Select all in the Apps Script editor (Ctrl+A)
   - Paste the code (Ctrl+V)
   - The file will auto-save

#### 2.2: Add HTML UI File

1. **Create HTML file**
   - Click the **"+"** icon next to "Files"
   - Select **"HTML"**
   - Name it: **"gmail-matrix"** (without .html extension)

2. **Copy the HTML code**
   - Open your local file: `gmail/matrix.html`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

3. **Paste into Apps Script**
   - In the new "gmail-matrix.html" file
   - Select all and paste (Ctrl+A, Ctrl+V)
   - Auto-saves

#### 2.3: Add Manifest File

1. **Enable manifest file**
   - Click the **gear icon** ⚙️ (Project Settings) on the left
   - Check the box: **"Show 'appsscript.json' manifest file in editor"**
   - Click back to **"Editor"** on the left

2. **Edit manifest**
   - You should now see `appsscript.json` in the files list
   - Click on it to open

3. **Copy the manifest**
   - Open your local file: `gmail/appsscript.json`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

4. **Replace in Apps Script**
   - In the `appsscript.json` editor
   - Select all and paste (Ctrl+A, Ctrl+V)
   - Auto-saves

---

### Step 3: Verify Files

You should now have **3 files** in your project:

```
Files:
├── Code.gs                    ✅ Server-side code
├── gmail-matrix.html          ✅ Full matrix UI
└── appsscript.json           ✅ Manifest
```

**Quick Check:**
- Code.gs should be ~370 lines
- gmail-matrix.html should be ~380 lines
- appsscript.json should be ~40 lines

**Important:** The appsscript.json file only appears after you enable "Show manifest file" in Project Settings. You cannot upload JSON files directly in Apps Script - you must enable the manifest and edit the file that appears.

---

### Step 4: Test Deploy

1. **Click "Deploy"** (top right)
   - Select **"Test deployments"**

2. **Install Test Deployment**
   - Click **"Install"** next to the test deployment
   - Or click **"Create new test"** if none exists

3. **Grant Permissions**
   - Click through the OAuth consent screens
   - Select your Google account
   - Click **"Allow"** to grant permissions

   **Permissions requested:**
   - Read email messages when you interact with the add-on
   - View your email address
   - Manage drafts and compose emails
   - Store user preferences

4. **Complete Installation**
   - You should see "Installation complete"
   - The add-on is now active in your Gmail

---

### Step 5: Test in Gmail

1. **Open Gmail**
   - Go to [mail.google.com](https://mail.google.com)
   - Make sure you're signed in to the same account

2. **Open an Email**
   - Click on any email to open it
   - Look at the **right sidebar**

3. **Find the Add-on Icon**
   - You should see the Eisenhower Matrix icon
   - It may be at the bottom of the sidebar
   - Click on it to activate

4. **Test the Card UI**
   The add-on should show:
   - Current email subject
   - Current email sender
   - Four quadrant buttons:
     - 🔴 Do First
     - 🔵 Schedule
     - 🟡 Delegate
     - ⚫ Eliminate
   - "📊 Open Full Matrix View" button

---

### Step 6: Test Features

#### Test 1: Add Email to Quadrant

1. **Click a quadrant button** (e.g., "🔴 Do First")
2. **Verify notification** appears: "Added to Do First"
3. **Check data persistence**:
   - Refresh Gmail
   - Open a different email
   - Come back to the same email
   - Click the add-on icon
   - The categorization should be remembered

#### Test 2: Open Full Matrix View

1. **Click "📊 Open Full Matrix View"**
2. **Verify overlay opens** with:
   - Header: "📊 Eisenhower Matrix"
   - Current email card
   - Four quadrant buttons
   - 4-quadrant matrix grid
   - Statistics bar (Total Items, Urgent, Important)
   - Refresh and Clear All buttons

#### Test 3: Full Matrix Functionality

In the full matrix view:

1. **Add current email** to different quadrants
2. **Verify item appears** in the correct quadrant
3. **Click on an item** to remove it
4. **Verify removal** confirmation dialog
5. **Test statistics** update as you add/remove items
6. **Test "Clear All"** button
7. **Test "Refresh"** button

#### Test 4: Multiple Emails

1. **Open different emails**
2. **Add each to different quadrants**
3. **Open full matrix view**
4. **Verify all emails** appear in their quadrants
5. **Check persistence** (refresh Gmail)

---

### Step 7: Debugging (If Issues Occur)

#### Check Execution Logs

1. **In Apps Script Editor**:
   - View → Execution log (or press Ctrl+Enter)
   - Check for any error messages

2. **Look for common issues**:
   - Permission errors
   - JSON parsing errors
   - Missing function errors

#### Test Individual Functions

In the Apps Script editor, you can test functions directly:

1. **Click the function dropdown** (top toolbar)
2. **Select a function** like `getMatrixData`
3. **Click "Run"** (play button)
4. **Check the execution log** for output

Example test:
```javascript
// Add this temporary function to test
function testStorage() {
  const data = getMatrixData();
  Logger.log(JSON.stringify(data, null, 2));
}
```

#### Check Browser Console

1. **In Gmail** (with add-on open):
   - Press F12 (Developer Tools)
   - Go to "Console" tab
   - Look for JavaScript errors
   - Errors will show in red

---

## Expected Behavior ✅

### Card UI (Quick View)

**What you should see:**
```
┌─────────────────────────────────┐
│ Eisenhower Matrix               │
│ Categorize by urgency and       │
│ importance                       │
├─────────────────────────────────┤
│ Current Message                  │
│ Subject: [Email Subject]         │
│ From: [Sender Name]              │
├─────────────────────────────────┤
│ Add to Quadrant                  │
│ [🔴 Do First]   [🔵 Schedule]   │
│ [🟡 Delegate]   [⚫ Eliminate]   │
├─────────────────────────────────┤
│ [📊 Open Full Matrix View]      │
└─────────────────────────────────┘
```

### Full Matrix View (HTML Overlay)

**What you should see:**
```
┌──────────────────────────────────────────┐
│  📊 Eisenhower Matrix                    │
│  Organize by urgency & importance        │
├──────────────────────────────────────────┤
│  Current Email                           │
│  [Subject and metadata]                  │
│  [🔴][🔵][🟡][⚫] buttons                │
├──────────────────────────────────────────┤
│  [🔄 Refresh] [🗑️ Clear All]            │
├──────────────────────────────────────────┤
│  Stats: [0 Total] [0 Urgent] [0 Import] │
├──────────────────────────────────────────┤
│  ┌───────────┬───────────┐               │
│  │ DO FIRST  │ SCHEDULE  │               │
│  │ Urgent +  │ Not U. +  │               │
│  │ Important │ Important │               │
│  ├───────────┼───────────┤               │
│  │ DELEGATE  │ ELIMINATE │               │
│  │ Urgent +  │ Not U. +  │               │
│  │ Not Imp.  │ Not Imp.  │               │
│  └───────────┴───────────┘               │
└──────────────────────────────────────────┘
```

---

## Common Issues & Solutions 🔧

### Issue: Add-on icon doesn't appear

**Solutions:**
- ✅ Make sure test deployment is active
- ✅ Refresh Gmail (Ctrl+R)
- ✅ Try a different email
- ✅ Check if add-on is enabled in Gmail settings

### Issue: Permission errors

**Solutions:**
- ✅ Re-grant permissions in Apps Script
- ✅ Check OAuth scopes in appsscript.json
- ✅ Make sure you're using the same Google account

### Issue: "Open Full Matrix View" doesn't work

**Solutions:**
- ✅ Check browser console for errors
- ✅ Verify gmail-matrix.html file exists
- ✅ Check that HtmlService is working (logs)

### Issue: Data not persisting

**Solutions:**
- ✅ Check PropertiesService in Apps Script
- ✅ Test with this function:
```javascript
function checkStorage() {
  const props = PropertiesService.getUserProperties();
  const data = props.getProperty('eisenhowerMatrix');
  Logger.log(data);
}
```

### Issue: Card doesn't show current email

**Solutions:**
- ✅ Check that messageId is being passed
- ✅ Verify GmailApp.getMessageById() works
- ✅ Check execution logs for errors

---

## Testing Checklist ✅

Use this checklist to verify all functionality:

### Basic Functionality
- [ ] Add-on icon appears in Gmail sidebar
- [ ] Card UI loads with current email info
- [ ] All 4 quadrant buttons are visible and clickable
- [ ] Notifications appear when adding to quadrant
- [ ] "Open Full Matrix View" button works

### Full Matrix View
- [ ] HTML overlay opens successfully
- [ ] Current email card displays correctly
- [ ] All 4 quadrants are visible
- [ ] Statistics bar shows correct counts
- [ ] Refresh button works
- [ ] Clear All button works

### Data Persistence
- [ ] Items persist after refreshing Gmail
- [ ] Items persist across different emails
- [ ] Items can be removed by clicking
- [ ] Clear All removes all items

### Cross-Email Testing
- [ ] Can add multiple different emails
- [ ] Each email appears in correct quadrant
- [ ] All emails visible in full matrix view
- [ ] Statistics update correctly

---

## Performance Benchmarks

**Expected load times:**
- Card UI: < 1 second
- Full matrix view: 1-2 seconds
- Add to quadrant: < 500ms
- Refresh data: < 1 second

**Data limits:**
- PropertiesService: 500KB per property
- Can store ~500-1000 emails comfortably

---

## Next Steps After Testing

Once testing is successful:

1. **Document any issues** you found
2. **Take screenshots** of working add-on
3. **Note any performance concerns**
4. **Consider publishing** to Workspace Marketplace

---

## Success Criteria ✅

Your Gmail add-on is working correctly if:

✅ **Card UI displays** with current email
✅ **Can add emails** to all 4 quadrants
✅ **Data persists** after refresh
✅ **Full matrix view** opens successfully
✅ **Statistics update** correctly
✅ **Can remove items** from matrix
✅ **No console errors** in browser
✅ **No execution errors** in Apps Script

---

## Need Help?

If you encounter issues:

1. **Check Apps Script logs** (View → Execution log)
2. **Check browser console** (F12 → Console tab)
3. **Review permissions** granted to add-on
4. **Verify all files** are uploaded correctly
5. **Test with simple email** first

---

**Ready to test? Follow the steps above and let me know what happens!** 🚀
