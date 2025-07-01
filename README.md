# Eisenhower Matrix for Outlook

A free Outlook add-in that helps you organize emails and tasks using the famous Eisenhower Matrix productivity method. Categorize items by urgency and importance to boost your productivity.

![Eisenhower Matrix](https://via.placeholder.com/600x400/0078d4/white?text=Eisenhower+Matrix+for+Outlook)

## 🚀 Features

- **Four Quadrants**: Organize emails into Do First, Schedule, Delegate, and Eliminate categories
- **Visual Matrix**: See all your categorized items in a clean, color-coded interface
- **Cross-Device Sync**: Your matrix data syncs across all devices with Office 365
- **Easy Management**: Click to remove items, refresh matrix, or clear all
- **Professional Design**: Matches Outlook's interface for seamless integration

## 📥 Installation

### Option 1: Direct Sideload (Recommended)
1. **Download the manifest**: Right-click [manifest.xml](https://YOUR_GITHUB_USERNAME.github.io/eisenhower-matrix-addin/manifest.xml) and save it to your computer
2. **Open Outlook** (desktop or web)
3. **Install the add-in**:
   - **Outlook Desktop**: Go to **File** → **Get Add-ins** → **My add-ins** → **Add a custom add-in** → **Add from file**
   - **Outlook Web**: Click the **Settings gear** → **View all Outlook settings** → **General** → **Manage add-ins** → **Add a custom add-in** → **Add from file**
4. **Upload** the manifest.xml file
5. **Start using**: Open any email and look for the "Open Matrix" button in the ribbon!

### Option 2: From Repository
1. Download or clone this repository
2. Follow the sideload instructions above with the manifest.xml file

## 🎯 How to Use

1. **Open an Email**: Select any email in Outlook
2. **Click "Open Matrix"**: Find the button in the Outlook ribbon
3. **Categorize**: Click one of the four quadrant buttons to categorize the email:
   - **🔴 Do First**: Urgent + Important (crises, emergencies)
   - **🔵 Schedule**: Not Urgent + Important (planning, prevention)
   - **🟡 Delegate**: Urgent + Not Important (interruptions, some meetings)
   - **⚫ Eliminate**: Not Urgent + Not Important (time wasters, some emails)
4. **View Matrix**: See all your categorized items in the visual matrix
5. **Manage Items**: Click on any item to remove it from the matrix

## 🛠️ Technical Details

- **Technology**: HTML, CSS, JavaScript with Office.js API
- **Storage**: Uses Office roaming settings for cross-device sync
- **Compatibility**: Works with Outlook 2016+, Outlook on the web, Outlook mobile
- **Hosting**: GitHub Pages (free, reliable, HTTPS)

## 📱 Screenshots

### Matrix View
The main interface showing all four quadrants with categorized emails:

```
┌─────────────────┬─────────────────┐
│   DO FIRST      │   SCHEDULE      │
│ Urgent +        │ Not Urgent +    │
│ Important       │ Important       │
│                 │                 │
│ [Email items]   │ [Email items]   │
├─────────────────┼─────────────────┤
│   DELEGATE      │   ELIMINATE     │
│ Urgent +        │ Not Urgent +    │
│ Not Important   │ Not Important   │
│                 │                 │
│ [Email items]   │ [Email items]   │
└─────────────────┴─────────────────┘
```

## 🔧 Development

Want to customize or contribute? Here's how to set up local development:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/eisenhower-matrix-addin.git
cd eisenhower-matrix-addin
# Serve locally with HTTPS for testing
python -m http.server 8000
# Or use any local server with HTTPS
```

## 📄 Files Structure

```
eisenhower-matrix-addin/
├── manifest.xml          # Add-in configuration
├── taskpane.html         # Main interface
├── commands.html         # Required commands file
├── icons/               # Add-in icons
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-80.png
│   └── icon-128.png
├── README.md            # This file
└── LICENSE              # MIT License
```

## ❓ Troubleshooting

**Add-in doesn't appear in Outlook:**
- Make sure you uploaded the correct manifest.xml file
- Check that your Outlook version supports add-ins (2016+ required)
- Try restarting Outlook after installation

**Button not showing in ribbon:**
- Open an email first (the button only appears when viewing emails)
- Check if the add-in is enabled in your add-ins list

**Data not syncing between devices:**
- Ensure you're signed in to the same Office 365 account on all devices
- Data syncs automatically with Office roaming settings

**Can't connect to add-in:**
- Check your internet connection
- The add-in files are hosted on GitHub Pages and require internet access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Some ideas for improvements:

- [ ] Add keyboard shortcuts
- [ ] Export matrix to Excel/CSV
- [ ] Integration with Microsoft To-Do
- [ ] Custom quadrant names
- [ ] Bulk email categorization
- [ ] Analytics and reporting

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Eisenhower Matrix productivity method
- Built with Microsoft Office JavaScript API
- Icons from Microsoft Fluent Design System

## 🔗 Links

- **Live Add-in**: [https://YOUR_GITHUB_USERNAME.github.io/eisenhower-matrix-addin/](https://YOUR_GITHUB_USERNAME.github.io/eisenhower-matrix-addin/)
- **Issues & Support**: [GitHub Issues](https://github.com/YOUR_GITHUB_USERNAME/eisenhower-matrix-addin/issues)
- **Microsoft Office Add-ins Documentation**: [docs.microsoft.com](https://docs.microsoft.com/en-us/office/dev/add-ins/)

---

**Made with ❤️ for productivity enthusiasts**