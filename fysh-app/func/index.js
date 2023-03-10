const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore()
    .collection("messages")
      .add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original and creates
// an uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document("/messages/{documentId}")
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log("Uppercasing", context.params.documentId, original);

      const uppercase = original.toUpperCase();

      // You must return a Promise when performing asynchronous tasks
      // inside a Functions such as writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });

exports.updateTournamentStatus = functions.pubsub.schedule('every 2 minutes').onRun(async (context) => {
  const tournamentsRef = firestore.collection('tournaments');
  const now = new Date();
  

  const tournamentsToClose = await tournamentsRef.where('isOpen', '==', true).get();
  tournamentsToClose.forEach(async (tournamentDoc) => {
    const tournamentData = tournamentDoc.data();
    const end = new Date(tournamentData.end_date);
    if (end <= now) {
      await tournamentDoc.ref.update({ isOpen: false });
    }
  });
  
  const tournamentsToOpen = await tournamentsRef.where('isOpen', '==', false).get();
  
  tournamentsToOpen.forEach(async (tournamentDoc) => {
    const tournamentData = tournamentDoc.data();
    const start = new Date(tournamentData.start_date);
    const end = new Date(tournamentData.end_date)
    if (start <= now && end >= now) {
      await tournamentDoc.ref.update({ isOpen: true });
    }
  });
  
  return null;

  });