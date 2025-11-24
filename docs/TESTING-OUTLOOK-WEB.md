# Testing Eisenhower Matrix on Outlook Web

This guide will help you test your Eisenhower Matrix add-in on Outlook Web (outlook.office.com or outlook.live.com).

## Prerequisites

✅ Your files must be hosted on GitHub Pages at: `https://shaia.github.io/eisenhower-matrix-addin/`
✅ The manifest.xml must be accessible at: `https://shaia.github.io/eisenhower-matrix-addin/outlook/manifest.xml`

## Step 1: Verify GitHub Pages Deployment

Before testing, make sure your site is live:

1. Visit: `https://shaia.github.io/eisenhower-matrix-addin/outlook/manifest.xml`
2. You should see your XML manifest file
3. Also check: `https://shaia.github.io/eisenhower-matrix-addin/outlook/taskpane.html`

If these URLs don't work, push your changes and enable GitHub Pages in your repository settings.

## Step 2: Sideload the Add-in in Outlook Web

### Method 1: Using the Ribbon (Recommended)

1. **Open Outlook Web**:
   - Go to [outlook.office.com](https://outlook.office.com) or [outlook.live.com](https://outlook.live.com)
   - Sign in with your Microsoft account

2. **Open any email** (or compose a new one)

3. **Access Add-ins**:
   - Click the **three dots (...)** in the top right of the email
   - Select **"Get Add-ins"** or **"Apps"**

4. **Add Custom Add-in**:
   - In the Add-ins dialog, click **"My add-ins"** in the left sidebar
   - Scroll down and click **"+ Add a custom add-in"**
   - Select **"Add from URL..."**

5. **Enter Manifest URL**:
   ```
   https://shaia.github.io/eisenhower-matrix-addin/outlook/manifest.xml
   ```

6. **Install**:
   - Click **"OK"** or **"Install"**
   - You may see a warning about custom add-ins - click **"Install"** again

7. **Confirm Installation**:
   - You should see a success message
   - The add-in is now installed

### Method 2: Using Office Admin Center (For Microsoft 365 Business/Enterprise)

If you have admin access to your Microsoft 365 organization:

1. Go to [Microsoft 365 admin center](https://admin.microsoft.com)
2. Navigate to **Settings > Integrated apps**
3. Click **Upload custom apps**
4. Choose **Provide link to manifest file**
5. Enter your manifest URL
6. Follow the prompts to deploy to users

## Step 3: Use the Add-in

### Opening the Add-in

1. **Open any email** in Outlook Web
2. Look for the **"Eisenhower"** button in the ribbon (top of the email)
   - Or click the three dots **(...)** and find **"Matrix"** in the dropdown
3. Click the button to open the task pane on the right

### Expected Behavior

You should see:
- **Header**: "📊 Eisenhower Matrix"
- **Current email info**: Subject and sender of the selected email
- **Four quadrant buttons**:
  - 🔴 **Do First** (red)
  - 🔵 **Schedule** (blue)
  - 🟡 **Delegate** (orange)
  - ⚫ **Eliminate** (gray)
- **Statistics bar**: Shows total items, urgent count, important count
- **Matrix view**: 2x2 grid showing all categorized items

### Testing Features

#### 1. **Add Email to Quadrant**
- Select an email
- Open the add-in
- Click one of the four quadrant buttons
- You should see:
  - A success toast message
  - The email appears in the corresponding quadrant
  - Statistics update

#### 2. **Remove Item**
- Click on any item in the matrix
- Confirm the removal dialog
- Item should be removed

#### 3. **Refresh Matrix**
- Click the **🔄 Refresh Matrix** button
- Matrix should reload with current data

#### 4. **Clear All**
- Click the **🗑️ Clear All** button
- Confirm the dialog
- All items should be removed

#### 5. **Data Persistence**
- Add some emails to quadrants
- Close the add-in
- Open it again
- Your categorized emails should still be there

#### 6. **Test in Different Views**
- Message read mode (viewing an email)
- Message compose mode (writing an email)
- Appointment view (calendar events)

## Step 4: Troubleshooting

### Add-in doesn't appear

- **Clear browser cache**: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- **Hard refresh**: Ctrl+F5 or Cmd+Shift+R
- **Try different browser**: Chrome, Edge, Firefox
- **Check manifest URL**: Make sure it's accessible publicly
- **Check CORS**: Your GitHub Pages should serve files with correct headers (usually automatic)

### Task pane is blank

- **Open browser console**: F12 → Console tab
- **Look for errors**: Red error messages will indicate the issue
- **Common issues**:
  - `Office.js` not loading - Check your internet connection
  - `matrix-manager.js` 404 error - File path is wrong
  - CSS not loading - Check your stylesheet path

### Icons not showing

- **Check icon URLs** in manifest.xml:
  ```xml
  <bt:Image id="Icon.16x16" DefaultValue="https://shaia.github.io/eisenhower-matrix-addin/shared/icons/icon-16.svg"/>
  <bt:Image id="Icon.32x32" DefaultValue="https://shaia.github.io/eisenhower-matrix-addin/shared/icons/icon-32.svg"/>
  <bt:Image id="Icon.80x80" DefaultValue="https://shaia.github.io/eisenhower-matrix-addin/shared/icons/icon-80.svg"/>
  ```
- Visit each URL directly to verify they're accessible
- Note: Outlook may cache icons - try removing and re-adding the add-in

### Data not persisting

- **Roaming settings** might not be enabled for your account
- The add-in will fallback to `localStorage`
- Check browser console for `roamingSettings` errors

### Can't install custom add-in

- **Organization policy**: Your admin may have blocked custom add-ins
- **Account type**: Some free accounts have restrictions
- **Browser permissions**: Check if pop-ups are blocked

## Step 5: Test Different Scenarios

### Scenario 1: Email Triage Workflow
1. Open your inbox
2. Go through emails one by one
3. For each email, open the add-in and categorize it
4. Verify all emails appear in the matrix

### Scenario 2: Review Urgent Items
1. Add several emails to different quadrants
2. Check the statistics bar
3. Verify urgent count = (Q1 + Q3)
4. Verify important count = (Q1 + Q2)

### Scenario 3: Cross-Device Sync (if using Microsoft 365)
1. Add emails on Outlook Web
2. Open Outlook desktop app
3. Check if data syncs (requires roaming settings)

## Expected Visual Layout

```
┌─────────────────────────────────────┐
│ 📊 Eisenhower Matrix                │
│ Organize by urgency & importance    │
├─────────────────────────────────────┤
│ Current Email:                      │
│ Re: Project Update                  │
│ From: john@example.com • 11/24/2025│
│ [🔴 Do First] [🔵 Schedule]        │
│ [🟡 Delegate] [⚫ Eliminate]        │
├─────────────────────────────────────┤
│ [🔄 Refresh] [🗑️ Clear All]        │
├─────────────────────────────────────┤
│ Total: 5 | Urgent: 3 | Important: 4│
├─────────────────────────────────────┤
│ ┌─────────┬─────────┐              │
│ │ DO FIRST│ SCHEDULE│              │
│ │ Urgent +│ Not Urg │              │
│ │ Import  │ Import  │              │
│ ├─────────┼─────────┤              │
│ │DELEGATE │ELIMINATE│              │
│ │ Urgent +│ Not Urg │              │
│ │ Not Imp │ Not Imp │              │
│ └─────────┴─────────┘              │
└─────────────────────────────────────┘
```

## Browser Support

✅ **Supported Browsers**:
- Microsoft Edge (Recommended)
- Google Chrome
- Mozilla Firefox
- Safari (Mac)

❌ **Not Supported**:
- Internet Explorer

## Next Steps

After successful testing:
1. ✅ Verify all features work correctly
2. ✅ Test data persistence
3. ✅ Try different email scenarios
4. 🚀 Consider publishing to [AppSource](https://appsource.microsoft.com)
5. 📝 Collect user feedback

## Getting Help

- **Console logs**: Press F12 and check Console tab for errors
- **Network tab**: Check if files are loading correctly
- **GitHub Issues**: Report bugs at your repository
- **Microsoft Docs**: [Outlook Add-ins Documentation](https://docs.microsoft.com/en-us/office/dev/add-ins/outlook/)

## Success Checklist

- [ ] Add-in appears in Outlook Web ribbon
- [ ] Task pane opens when clicked
- [ ] Current email displays correctly
- [ ] Can add email to all 4 quadrants
- [ ] Statistics update correctly
- [ ] Can remove items from quadrants
- [ ] Data persists after closing/reopening
- [ ] Icons display properly
- [ ] Works in compose and read modes
- [ ] No console errors

Happy testing! 🎉
