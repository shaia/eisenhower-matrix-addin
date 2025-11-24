/**
 * Gmail Add-on Integration Script (Refactored)
 * Server-side functions for Gmail Add-on with HTML Service support
 * Now supports both Card UI (quick add) and HTML Service (full matrix view)
 */

/**
 * Callback for rendering the card for a specific Gmail message.
 * @param {Object} e - Event object containing message details
 * @return {CardService.Card} The card to show the user
 */
function getContextualAddOn(e) {
  // Log the event structure for debugging
  console.log('Event object:', JSON.stringify(e));

  // Get message ID and access token from the event object
  let messageId = null;
  let accessToken = null;
  let subject = 'Loading...';
  let sender = 'Loading...';

  // Gmail add-on event structure - try multiple possible paths
  try {
    if (e) {
      // Try different event object structures
      if (e.gmail && e.gmail.messageId) {
        messageId = e.gmail.messageId;
        accessToken = e.gmail.accessToken;
        console.log('Found messageId in e.gmail:', messageId);
      } else if (e.messageMetadata && e.messageMetadata.messageId) {
        messageId = e.messageMetadata.messageId;
        accessToken = e.messageMetadata.accessToken;
        console.log('Found messageId in e.messageMetadata:', messageId);
      } else if (e.parameters && e.parameters.messageId) {
        messageId = e.parameters.messageId;
        console.log('Found messageId in e.parameters:', messageId);
      }
    }

    // Try to get message details
    if (messageId) {
      try {
        const message = GmailApp.getMessageById(messageId);
        if (message) {
          subject = message.getSubject() || 'No Subject';
          sender = message.getFrom();

          // Store current message ID in user properties for HTML Service access
          const userProps = PropertiesService.getUserProperties();
          userProps.setProperty('currentMessageId', messageId);
        }
      } catch (error) {
        console.error('Error getting message details:', error);
        // Use fallback values but keep the messageId
        subject = 'Email Selected';
        sender = 'Click quadrant to categorize';
      }
    } else {
      // No messageId found - this is okay, just show default card
      console.log('No messageId found in event object');
      subject = 'Open an email';
      sender = 'Select an email to categorize it';
      messageId = ''; // Use empty string instead of null
    }
  } catch (error) {
    console.error('Error in getContextualAddOn:', error);
    subject = 'Error loading';
    sender = 'Please try again';
    messageId = '';
  }

  const card = createMatrixCardWithDetails(messageId, subject, sender);
  return [card];
}

/**
 * Callback for rendering the compose UI
 * @param {Object} e - Event object
 * @return {CardService.Card} The card to show to the user
 */
function getComposeAddOn(e) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Eisenhower Matrix')
      .setImageUrl('https://shaia.github.io/eisenhower-matrix-addin/shared/icons/icon-32.png'))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Open the full Eisenhower Matrix interface in a new window.'))
      .addWidget(CardService.newTextButton()
        .setText('Open Matrix')
        .setOpenLink(CardService.newOpenLink()
          .setUrl('https://shaia.github.io/eisenhower-matrix-addin/taskpane.html')
          .setOpenAs(CardService.OpenAs.FULL_SIZE)
          .setOnClose(CardService.OnClose.NOTHING))))
    .build();

  return [card];
}

/**
 * Create the main matrix card with provided details
 * @param {string} messageId - Gmail message ID
 * @param {string} subject - Email subject
 * @param {string} sender - Email sender
 * @return {CardService.Card} The card to display
 */
function createMatrixCardWithDetails(messageId, subject, sender) {
  // Use provided details or defaults
  subject = subject || 'No Subject';
  sender = sender || 'Unknown';
  messageId = messageId || '';

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Eisenhower Matrix')
      .setSubtitle('Categorize by urgency and importance')
      .setImageUrl('https://shaia.github.io/eisenhower-matrix-addin/shared/icons/icon-32.png'))

    // Current message section
    .addSection(CardService.newCardSection()
      .setHeader('Current Message')
      .addWidget(CardService.newKeyValue()
        .setTopLabel('Subject')
        .setContent(subject)
        .setMultiline(true))
      .addWidget(CardService.newKeyValue()
        .setTopLabel('From')
        .setContent(sender)))

    // Quadrant buttons section
    .addSection(CardService.newCardSection()
      .setHeader('Add to Quadrant')
      .addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText('🔴 Do First')
          .setBackgroundColor('#d83b01')
          .setOnClickAction(CardService.newAction()
            .setFunctionName('addToQuadrant1')
            .setParameters({messageId: messageId, subject: subject, sender: sender})))
        .addButton(CardService.newTextButton()
          .setText('🔵 Schedule')
          .setBackgroundColor('#0078d4')
          .setOnClickAction(CardService.newAction()
            .setFunctionName('addToQuadrant2')
            .setParameters({messageId: messageId, subject: subject, sender: sender}))))
      .addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText('🟡 Delegate')
          .setBackgroundColor('#ffaa44')
          .setOnClickAction(CardService.newAction()
            .setFunctionName('addToQuadrant3')
            .setParameters({messageId: messageId, subject: subject, sender: sender})))
        .addButton(CardService.newTextButton()
          .setText('⚫ Eliminate')
          .setBackgroundColor('#767676')
          .setOnClickAction(CardService.newAction()
            .setFunctionName('addToQuadrant4')
            .setParameters({messageId: messageId, subject: subject, sender: sender})))))

    // Open full interface button (HTML Service)
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextButton()
        .setText('📊 Open Full Matrix View')
        .setOnClickAction(CardService.newAction()
          .setFunctionName('openFullMatrixView'))))

    .build();

  return card;
}

/**
 * Open full matrix view - shows a visual 2x2 matrix layout
 * @return {CardService.ActionResponse}
 */
function openFullMatrixView() {
  const matrixData = getMatrixData();

  // Calculate statistics
  const total = (matrixData[1]?.length || 0) + (matrixData[2]?.length || 0) +
                (matrixData[3]?.length || 0) + (matrixData[4]?.length || 0);
  const urgent = (matrixData[1]?.length || 0) + (matrixData[3]?.length || 0);
  const important = (matrixData[1]?.length || 0) + (matrixData[2]?.length || 0);

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('📊 Eisenhower Matrix')
      .setSubtitle(`${total} emails categorized`));

  // Statistics section at the top
  const statsSection = CardService.newCardSection();
  statsSection.addWidget(CardService.newDecoratedText()
    .setText(`<b>${urgent}</b> Urgent  |  <b>${important}</b> Important  |  <b>${total}</b> Total`)
    .setWrapText(false));
  card.addSection(statsSection);

  // URGENT ROW - Q1 and Q3
  const urgentRow = CardService.newCardSection()
    .setHeader('⏰ URGENT');

  // Q1: Do First (Urgent + Important)
  const q1Items = matrixData[1] || [];
  urgentRow.addWidget(CardService.newDecoratedText()
    .setTopLabel('🔴 DO FIRST')
    .setText(`<b>${q1Items.length} emails</b> • Urgent + Important`)
    .setWrapText(true)
    .setButton(CardService.newTextButton()
      .setText('View →')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('showQuadrantDetail')
        .setParameters({ quadrant: '1' }))));

  // Q3: Delegate (Urgent + Not Important)
  const q3Items = matrixData[3] || [];
  urgentRow.addWidget(CardService.newDecoratedText()
    .setTopLabel('🟡 DELEGATE')
    .setText(`<b>${q3Items.length} emails</b> • Urgent + Not Important`)
    .setWrapText(true)
    .setButton(CardService.newTextButton()
      .setText('View →')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('showQuadrantDetail')
        .setParameters({ quadrant: '3' }))));

  card.addSection(urgentRow);

  // NOT URGENT ROW - Q2 and Q4
  const notUrgentRow = CardService.newCardSection()
    .setHeader('📅 NOT URGENT');

  // Q2: Schedule (Not Urgent + Important)
  const q2Items = matrixData[2] || [];
  notUrgentRow.addWidget(CardService.newDecoratedText()
    .setTopLabel('🔵 SCHEDULE')
    .setText(`<b>${q2Items.length} emails</b> • Not Urgent + Important`)
    .setWrapText(true)
    .setButton(CardService.newTextButton()
      .setText('View →')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('showQuadrantDetail')
        .setParameters({ quadrant: '2' }))));

  // Q4: Eliminate (Not Urgent + Not Important)
  const q4Items = matrixData[4] || [];
  notUrgentRow.addWidget(CardService.newDecoratedText()
    .setTopLabel('⚫ ELIMINATE')
    .setText(`<b>${q4Items.length} emails</b> • Not Urgent + Not Important`)
    .setWrapText(true)
    .setButton(CardService.newTextButton()
      .setText('View →')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('showQuadrantDetail')
        .setParameters({ quadrant: '4' }))));

  card.addSection(notUrgentRow);

  // Footer with back button
  card.setFixedFooter(CardService.newFixedFooter()
    .setPrimaryButton(CardService.newTextButton()
      .setText('← Back to Current Email')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('getContextualAddOn'))));

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .pushCard(card.build()))
    .build();
}

/**
 * Show details for a specific quadrant
 * @param {Object} e - Event object with quadrant parameter
 * @return {CardService.ActionResponse}
 */
function showQuadrantDetail(e) {
  const quadrant = parseInt(e.parameters.quadrant);
  const matrixData = getMatrixData();
  const items = matrixData[quadrant] || [];

  const quadrantInfo = {
    1: { name: '🔴 Do First', desc: 'Urgent + Important', advice: 'Do these tasks immediately!', color: '#d83b01' },
    2: { name: '🔵 Schedule', desc: 'Not Urgent + Important', advice: 'Plan time for these tasks', color: '#0078d4' },
    3: { name: '🟡 Delegate', desc: 'Urgent + Not Important', advice: 'Can someone else do these?', color: '#ffaa44' },
    4: { name: '⚫ Eliminate', desc: 'Not Urgent + Not Important', advice: 'Consider removing these', color: '#767676' }
  };

  const info = quadrantInfo[quadrant];
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle(info.name)
      .setSubtitle(`${items.length} emails • ${info.desc}`));

  // Advice section
  const adviceSection = CardService.newCardSection();
  adviceSection.addWidget(CardService.newTextParagraph()
    .setText(`<b>💡 ${info.advice}</b>`));
  card.addSection(adviceSection);

  // Show items
  const itemsSection = CardService.newCardSection()
    .setHeader('Emails in this quadrant');

  if (items.length === 0) {
    itemsSection.addWidget(CardService.newTextParagraph()
      .setText('<i>No emails in this quadrant yet.</i>'));
  } else {
    // Show up to 10 emails
    items.slice(0, 10).forEach(item => {
      itemsSection.addWidget(CardService.newKeyValue()
        .setTopLabel(item.subject || 'No Subject')
        .setContent(`From: ${item.sender || 'Unknown'}`)
        .setBottomLabel(item.date || '')
        .setMultiline(true));
    });

    if (items.length > 10) {
      itemsSection.addWidget(CardService.newTextParagraph()
        .setText(`<i>... and ${items.length - 10} more emails</i>`));
    }
  }
  card.addSection(itemsSection);

  // Footer with back button
  card.setFixedFooter(CardService.newFixedFooter()
    .setPrimaryButton(CardService.newTextButton()
      .setText('← Back to Matrix')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('openFullMatrixView'))));

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .pushCard(card.build()))
    .build();
}

/**
 * Add message to quadrant 1 (Urgent + Important)
 */
function addToQuadrant1(e) {
  return addMessageToQuadrant(e, 1, 'Do First');
}

/**
 * Add message to quadrant 2 (Not Urgent + Important)
 */
function addToQuadrant2(e) {
  return addMessageToQuadrant(e, 2, 'Schedule');
}

/**
 * Add message to quadrant 3 (Urgent + Not Important)
 */
function addToQuadrant3(e) {
  return addMessageToQuadrant(e, 3, 'Delegate');
}

/**
 * Add message to quadrant 4 (Not Urgent + Not Important)
 */
function addToQuadrant4(e) {
  return addMessageToQuadrant(e, 4, 'Eliminate');
}

/**
 * Generic function to add message to a quadrant
 * @param {Object} e - Event object with parameters
 * @param {number} quadrant - Quadrant number (1-4)
 * @param {string} quadrantName - Name of the quadrant
 * @return {CardService.ActionResponse}
 */
function addMessageToQuadrant(e, quadrant, quadrantName) {
  const params = e.parameters;
  const messageId = params.messageId;
  const subject = params.subject;
  const sender = params.sender;

  try {
    // Load existing matrix data
    const properties = PropertiesService.getUserProperties();
    let matrixData = { 1: [], 2: [], 3: [], 4: [] };

    const saved = properties.getProperty('eisenhowerMatrix');
    if (saved) {
      matrixData = JSON.parse(saved);
    }

    // Remove from all quadrants if exists
    for (let q = 1; q <= 4; q++) {
      if (matrixData[q]) {
        matrixData[q] = matrixData[q].filter(item => item.id !== messageId);
      }
    }

    // Add to selected quadrant
    if (!matrixData[quadrant]) {
      matrixData[quadrant] = [];
    }

    matrixData[quadrant].push({
      id: messageId,
      subject: subject,
      sender: sender,
      date: new Date().toLocaleDateString(),
      type: 'message'
    });

    // Save back to properties
    properties.setProperty('eisenhowerMatrix', JSON.stringify(matrixData));

    // Show notification
    const notification = CardService.newNotification()
      .setText(`Added "${subject}" to ${quadrantName}`);

    return CardService.newActionResponseBuilder()
      .setNotification(notification)
      .build();

  } catch (error) {
    console.error('Error adding to quadrant:', error);

    const notification = CardService.newNotification()
      .setText('Error: Could not add message to matrix');

    return CardService.newActionResponseBuilder()
      .setNotification(notification)
      .build();
  }
}

/**
 * Get matrix data for display
 * @return {Object} Matrix data
 */
function getMatrixData() {
  const properties = PropertiesService.getUserProperties();
  const saved = properties.getProperty('eisenhowerMatrix');

  if (saved) {
    return JSON.parse(saved);
  }

  return { 1: [], 2: [], 3: [], 4: [] };
}

/**
 * Get current email data for HTML Service
 * @return {Object|null} Current email data
 */
function getCurrentEmailData() {
  try {
    const userProps = PropertiesService.getUserProperties();
    const messageId = userProps.getProperty('currentMessageId');

    if (!messageId) {
      return null;
    }

    const message = GmailApp.getMessageById(messageId);
    if (!message) {
      return null;
    }

    return {
      id: message.getId(),
      subject: message.getSubject() || 'No Subject',
      sender: message.getFrom(),
      date: message.getDate().toLocaleDateString(),
      type: 'message'
    };
  } catch (error) {
    console.error('Error getting current email:', error);
    return null;
  }
}

/**
 * Add email to quadrant (called from HTML Service)
 * @param {number} quadrant - Quadrant number (1-4)
 * @param {Object} emailData - Email data object
 * @return {boolean} Success status
 */
function addEmailToQuadrant(quadrant, emailData) {
  try {
    const properties = PropertiesService.getUserProperties();
    let matrixData = getMatrixData();

    // Remove from all quadrants if exists
    for (let q = 1; q <= 4; q++) {
      if (matrixData[q]) {
        matrixData[q] = matrixData[q].filter(item => item.id !== emailData.id);
      }
    }

    // Add to selected quadrant
    if (!matrixData[quadrant]) {
      matrixData[quadrant] = [];
    }

    matrixData[quadrant].push({
      id: emailData.id,
      subject: emailData.subject,
      sender: emailData.sender,
      date: emailData.date,
      type: emailData.type || 'message',
      timestamp: Date.now()
    });

    // Save back
    properties.setProperty('eisenhowerMatrix', JSON.stringify(matrixData));
    return true;
  } catch (error) {
    console.error('Error adding email to quadrant:', error);
    return false;
  }
}

/**
 * Remove item from quadrant (called from HTML Service)
 * @param {number} quadrant - Quadrant number (1-4)
 * @param {string} itemId - Item ID to remove
 * @return {boolean} Success status
 */
function removeItemFromQuadrant(quadrant, itemId) {
  try {
    const properties = PropertiesService.getUserProperties();
    let matrixData = getMatrixData();

    if (!matrixData[quadrant]) {
      return false;
    }

    const initialLength = matrixData[quadrant].length;
    matrixData[quadrant] = matrixData[quadrant].filter(item => item.id !== itemId);

    if (matrixData[quadrant].length < initialLength) {
      properties.setProperty('eisenhowerMatrix', JSON.stringify(matrixData));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error removing item:', error);
    return false;
  }
}

/**
 * Clear all items (called from HTML Service)
 * @return {boolean} Success status
 */
function clearAllItems() {
  try {
    const properties = PropertiesService.getUserProperties();
    const emptyMatrix = { 1: [], 2: [], 3: [], 4: [] };
    properties.setProperty('eisenhowerMatrix', JSON.stringify(emptyMatrix));
    return true;
  } catch (error) {
    console.error('Error clearing matrix:', error);
    return false;
  }
}
