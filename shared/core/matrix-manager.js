/**
 * Eisenhower Matrix Core Business Logic
 * Platform-agnostic matrix data management
 * Can be used by Outlook, Gmail, or any other platform
 */

class MatrixManager {
    constructor() {
        this.matrixData = {
            1: [], // Urgent + Important (Do First)
            2: [], // Not Urgent + Important (Schedule)
            3: [], // Urgent + Not Important (Delegate)
            4: []  // Not Urgent + Not Important (Eliminate)
        };
    }

    /**
     * Get quadrant metadata
     * @param {number} quadrant - Quadrant number (1-4)
     * @returns {Object} Quadrant information
     */
    getQuadrantInfo(quadrant) {
        const quadrants = {
            1: {
                name: 'Do First',
                description: 'Urgent + Important',
                color: '#d83b01',
                icon: '🔴',
                examples: 'Crises, emergencies, deadlines'
            },
            2: {
                name: 'Schedule',
                description: 'Not Urgent + Important',
                color: '#0078d4',
                icon: '🔵',
                examples: 'Planning, prevention, relationship building'
            },
            3: {
                name: 'Delegate',
                description: 'Urgent + Not Important',
                color: '#ffaa44',
                icon: '🟡',
                examples: 'Interruptions, some meetings, some emails'
            },
            4: {
                name: 'Eliminate',
                description: 'Not Urgent + Not Important',
                color: '#767676',
                icon: '⚫',
                examples: 'Time wasters, busy work, some social media'
            }
        };
        return quadrants[quadrant] || null;
    }

    /**
     * Load matrix data from any storage
     * @param {Object} data - Matrix data object
     */
    loadData(data) {
        if (data && typeof data === 'object') {
            this.matrixData = {
                1: data[1] || [],
                2: data[2] || [],
                3: data[3] || [],
                4: data[4] || []
            };
        }
    }

    /**
     * Get all matrix data
     * @returns {Object} Complete matrix data
     */
    getData() {
        return { ...this.matrixData };
    }

    /**
     * Add item to a quadrant
     * @param {number} quadrant - Quadrant number (1-4)
     * @param {Object} item - Item to add
     * @returns {boolean} Success status
     */
    addItem(quadrant, item) {
        if (!this._isValidQuadrant(quadrant)) {
            return false;
        }

        // Remove item from all quadrants if it exists (prevent duplicates)
        this.removeItemById(item.id);

        // Add to selected quadrant
        this.matrixData[quadrant].push({
            id: item.id,
            subject: item.subject || 'No Subject',
            sender: item.sender || 'Unknown',
            date: item.date || new Date().toLocaleDateString(),
            type: item.type || 'message',
            timestamp: Date.now()
        });

        return true;
    }

    /**
     * Remove item from specific quadrant
     * @param {number} quadrant - Quadrant number (1-4)
     * @param {string} itemId - Item ID to remove
     * @returns {boolean} Success status
     */
    removeItem(quadrant, itemId) {
        if (!this._isValidQuadrant(quadrant)) {
            return false;
        }

        const initialLength = this.matrixData[quadrant].length;
        this.matrixData[quadrant] = this.matrixData[quadrant].filter(
            item => item.id !== itemId
        );

        return this.matrixData[quadrant].length < initialLength;
    }

    /**
     * Remove item from all quadrants
     * @param {string} itemId - Item ID to remove
     * @returns {boolean} Success status
     */
    removeItemById(itemId) {
        let removed = false;
        for (let q = 1; q <= 4; q++) {
            if (this.removeItem(q, itemId)) {
                removed = true;
            }
        }
        return removed;
    }

    /**
     * Get items in a specific quadrant
     * @param {number} quadrant - Quadrant number (1-4)
     * @returns {Array} Items in quadrant
     */
    getQuadrantItems(quadrant) {
        if (!this._isValidQuadrant(quadrant)) {
            return [];
        }
        return [...this.matrixData[quadrant]];
    }

    /**
     * Clear all items from a quadrant
     * @param {number} quadrant - Quadrant number (1-4)
     * @returns {boolean} Success status
     */
    clearQuadrant(quadrant) {
        if (!this._isValidQuadrant(quadrant)) {
            return false;
        }
        this.matrixData[quadrant] = [];
        return true;
    }

    /**
     * Clear all items from all quadrants
     */
    clearAll() {
        this.matrixData = {
            1: [],
            2: [],
            3: [],
            4: []
        };
    }

    /**
     * Get statistics about the matrix
     * @returns {Object} Statistics object
     */
    getStats() {
        return {
            total: this._getTotalItems(),
            byQuadrant: {
                1: this.matrixData[1].length,
                2: this.matrixData[2].length,
                3: this.matrixData[3].length,
                4: this.matrixData[4].length
            },
            mostUsedQuadrant: this._getMostUsedQuadrant(),
            isEmpty: this._getTotalItems() === 0
        };
    }

    /**
     * Find item by ID across all quadrants
     * @param {string} itemId - Item ID to find
     * @returns {Object|null} Item and its quadrant, or null
     */
    findItem(itemId) {
        for (let q = 1; q <= 4; q++) {
            const item = this.matrixData[q].find(item => item.id === itemId);
            if (item) {
                return { item, quadrant: q };
            }
        }
        return null;
    }

    /**
     * Move item to different quadrant
     * @param {string} itemId - Item ID to move
     * @param {number} toQuadrant - Target quadrant (1-4)
     * @returns {boolean} Success status
     */
    moveItem(itemId, toQuadrant) {
        const found = this.findItem(itemId);
        if (!found || !this._isValidQuadrant(toQuadrant)) {
            return false;
        }

        if (found.quadrant === toQuadrant) {
            return true; // Already in target quadrant
        }

        // Remove from current quadrant
        this.removeItem(found.quadrant, itemId);

        // Add to new quadrant
        this.matrixData[toQuadrant].push(found.item);

        return true;
    }

    /**
     * Export matrix data as JSON
     * @returns {string} JSON string
     */
    exportJSON() {
        return JSON.stringify(this.matrixData, null, 2);
    }

    /**
     * Import matrix data from JSON
     * @param {string} jsonString - JSON string to import
     * @returns {boolean} Success status
     */
    importJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.loadData(data);
            return true;
        } catch (e) {
            console.error('Failed to import JSON:', e);
            return false;
        }
    }

    // Private helper methods

    _isValidQuadrant(quadrant) {
        return quadrant >= 1 && quadrant <= 4;
    }

    _getTotalItems() {
        return Object.values(this.matrixData).reduce(
            (sum, items) => sum + items.length,
            0
        );
    }

    _getMostUsedQuadrant() {
        let maxCount = 0;
        let mostUsed = 1;

        for (let q = 1; q <= 4; q++) {
            if (this.matrixData[q].length > maxCount) {
                maxCount = this.matrixData[q].length;
                mostUsed = q;
            }
        }

        return mostUsed;
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixManager;
}
if (typeof window !== 'undefined') {
    window.MatrixManager = MatrixManager;
}
