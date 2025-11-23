/**
 * Email Platform Abstraction Layer
 * Provides a unified interface for both Outlook and Gmail
 */

class EmailAdapter {
    constructor() {
        this.platform = null;
        this.isReady = false;
    }

    /**
     * Initialize the appropriate platform adapter
     * @returns {Promise<void>}
     */
    async initialize() {
        // Detect platform
        if (typeof Office !== 'undefined' && Office.context && Office.context.mailbox) {
            this.platform = new OutlookAdapter();
        } else if (typeof GmailApp !== 'undefined') {
            this.platform = new GmailAdapter();
        } else {
            throw new Error('Unsupported email platform');
        }

        await this.platform.initialize();
        this.isReady = true;
    }

    /**
     * Get current email/message item
     * @returns {Promise<EmailItem>}
     */
    async getCurrentItem() {
        if (!this.isReady) throw new Error('Adapter not initialized');
        return await this.platform.getCurrentItem();
    }

    /**
     * Save data to platform storage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {Promise<void>}
     */
    async saveData(key, value) {
        if (!this.isReady) throw new Error('Adapter not initialized');
        return await this.platform.saveData(key, value);
    }

    /**
     * Load data from platform storage
     * @param {string} key - Storage key
     * @returns {Promise<any>}
     */
    async loadData(key) {
        if (!this.isReady) throw new Error('Adapter not initialized');
        return await this.platform.loadData(key);
    }

    /**
     * Show notification to user
     * @param {string} message - Notification message
     * @returns {Promise<void>}
     */
    async showNotification(message) {
        if (!this.isReady) throw new Error('Adapter not initialized');
        return await this.platform.showNotification(message);
    }

    /**
     * Get platform name
     * @returns {string}
     */
    getPlatformName() {
        return this.platform ? this.platform.name : 'unknown';
    }
}

/**
 * EmailItem interface
 * @typedef {Object} EmailItem
 * @property {string} subject - Email subject
 * @property {string} sender - Sender name/email
 * @property {string} date - Date string
 * @property {string} id - Unique identifier
 * @property {string} type - Item type (message/appointment)
 */

/**
 * Outlook Platform Adapter
 */
class OutlookAdapter {
    constructor() {
        this.name = 'Outlook';
    }

    async initialize() {
        return new Promise((resolve) => {
            if (Office.context.mailbox) {
                resolve();
            } else {
                Office.onReady(() => resolve());
            }
        });
    }

    async getCurrentItem() {
        const item = Office.context.mailbox.item;
        if (!item) return null;

        return {
            subject: item.subject || 'No Subject',
            sender: item.from ? item.from.displayName : 'Unknown',
            date: item.dateTimeCreated ? item.dateTimeCreated.toLocaleDateString() : new Date().toLocaleDateString(),
            id: item.itemId || this._generateId(),
            type: item.itemType || 'message'
        };
    }

    async saveData(key, value) {
        return new Promise((resolve, reject) => {
            try {
                if (Office.context.roamingSettings) {
                    Office.context.roamingSettings.set(key, JSON.stringify(value));
                    Office.context.roamingSettings.saveAsync((result) => {
                        if (result.status === Office.AsyncResultStatus.Succeeded) {
                            resolve();
                        } else {
                            // Fallback to localStorage
                            localStorage.setItem(key, JSON.stringify(value));
                            resolve();
                        }
                    });
                } else {
                    localStorage.setItem(key, JSON.stringify(value));
                    resolve();
                }
            } catch (e) {
                localStorage.setItem(key, JSON.stringify(value));
                resolve();
            }
        });
    }

    async loadData(key) {
        try {
            if (Office.context.roamingSettings) {
                const data = Office.context.roamingSettings.get(key);
                return data ? JSON.parse(data) : null;
            } else {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            }
        } catch (e) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        }
    }

    async showNotification(message) {
        console.log('[Outlook]', message);
        // Could use Office.context.mailbox.item.notificationMessages in future
    }

    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

/**
 * Gmail Platform Adapter
 */
class GmailAdapter {
    constructor() {
        this.name = 'Gmail';
    }

    async initialize() {
        // Gmail Apps Script is synchronous, no async initialization needed
        return Promise.resolve();
    }

    async getCurrentItem() {
        try {
            // Get current message from Gmail context
            const accessToken = ScriptApp.getOAuthToken();
            const messageId = this._getCurrentMessageId();

            if (!messageId) return null;

            const message = GmailApp.getMessageById(messageId);

            return {
                subject: message.getSubject() || 'No Subject',
                sender: message.getFrom(),
                date: message.getDate().toLocaleDateString(),
                id: message.getId(),
                type: 'message'
            };
        } catch (e) {
            console.error('Error getting Gmail message:', e);
            return null;
        }
    }

    async saveData(key, value) {
        try {
            const properties = PropertiesService.getUserProperties();
            properties.setProperty(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to Gmail properties:', e);
            // Fallback to localStorage if available
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value));
            }
        }
    }

    async loadData(key) {
        try {
            const properties = PropertiesService.getUserProperties();
            const data = properties.getProperty(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from Gmail properties:', e);
            // Fallback to localStorage if available
            if (typeof localStorage !== 'undefined') {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            }
            return null;
        }
    }

    async showNotification(message) {
        console.log('[Gmail]', message);
        // Could use Card notifications in Gmail Add-ons
    }

    _getCurrentMessageId() {
        // This will be populated by Gmail Add-on context
        // For now, return null - will be enhanced when integrated with Gmail Add-on framework
        if (typeof window !== 'undefined' && window.gmailMessageId) {
            return window.gmailMessageId;
        }
        return null;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmailAdapter, OutlookAdapter, GmailAdapter };
}
