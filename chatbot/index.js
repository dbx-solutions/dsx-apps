/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

const DBX_ACCESS_TOKEN = "sl.BMR3yG5Sc-UzIX3fQdwohXzyrhDxihRuJNFm9GmIY2cDe-0iNxoFgnUdb6Cjsu7Wi7HBiL11hJ8oX_NxqFW-3dxjjNXct4mcC7meUXPgtLPbSNLl8k5ooR_WQSFN_r6mu-1ICCp4_mTM";

const STATES = {
  "GREETING": 0,
  "TOP_LEVEL_DOC_DECISION": 1,
  "SELECT_DOCUMENT": 2,
  "DELIVER_INCOME_DOCUMENT": 3,
  "DELIVER_POST_RELEASE_DOCUMENT": 4,
  "DELIVER_HEALTH_DOCUMENT": 5,
  "DELIVER_SCHOOL_DOCUMENT": 6,
  "DELIVER_USCIS_DOCUMENT": 7,
  "DELIVER_PERSONAL_ID_DOCUMENT": 8,
};

const STATE_NAMES = new Map(Array.from(STATES, a => a.reverse()));

let STATE = STATES.GREETING;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  dbx = require("dropbox"),
  app = express().use(body_parser.json()); // creates express http server

const port = process.env.PORT || 1337;

// Sets server port and logs message on success
app.listen(port, () => console.log(`webhook is listening on port ${port}`));

app.get("/test", (req, res) => {
  console.log("here");
  res.send("hello there");
})

const docs = {
  "Income-based documentation": [
    "Paystubs"
  ], 
  "Health related": [
    "Hospital discharge plans",
    "Immunization records",
    "Health insurance card"
  ], 
  "School related": [
    "Report cards",
    "IEP plans",
    "Non-parent affidavit"
  ], 
  "USCIS related docs": [
    "Case status/ receipts notices (I-797)",
    "OTIP letter"
  ], 
  "Personal IDs": [
    "Driver's license",
    "Consulate ID",
    "Copies of passport",
    "Work permit",
    "Social security card",
    "Verification of release form"
  ], 
  "Post released docs": [
    "Medical records",
    "List of local service providers"
  ]
};

function getTopLevelDocsList() {
  return "1. Income-based documentation\n2. Health related\n3. School related\n4. USCIS related docs\n5. Personal IDs\n6. Post Release Documents";
}

function getIncomeBasedDocsList() {
  return "1. Paystubs";
}

function getHealthRelatedDocsList() {
  return "1. Hospital discharge plans\n2. Immunization records\n3. Health insurance card";
}

function getSchoolRelatedDocsList() {
  return "1. Report cards\n2. IEP plans\n3. Non-parent affidavit";
}

function getUscisRelatedDocsList() {
  return "1. Case status/ receipts notices (I-797)\n2. OTIP letter";
}

function getPersonalIdsDocList() {
  return "1. Driver's license\n2. Consulate ID\n3. Copies of passport\n4. Work permit\n5. Social security card\n6. Verification of release form";
}

function getPostReleaseDocsList() {
  return "1. Medical records\n2. List of local service providers";
 
}

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;


  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      // Check the Incoming webhook message
      console.log(JSON.stringify(req.body, null, 2));
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      console.log("STATE: " + STATE);
      if (STATE === STATES.GREETING) {
        sendMessage(phone_number_id, from, getTopLevelDocsList());
        console.log("Sent greeting");
        STATE = STATES.TOP_LEVEL_DOC_DECISION;
      } else if(STATE === STATES.TOP_LEVEL_DOC_DECISION) {
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        STATE = STATES.GREETING;
        let msg = "Sorry, that doesn't seem to be one of the available options. Please start again.";
        if (msg_body === "1") {
          msg = getIncomeBasedDocsList();
          STATE = STATES.DELIVER_INCOME_DOCUMENT;
        } else if (msg_body === "2") {
          msg = getHealthRelatedDocsList();
          STATE = STATES.DELIVER_HEALTH_DOCUMENT;
        } else if (msg_body === "3") {
          msg = getSchoolRelatedDocsList();
          STATE = STATES.DELIVER_SCHOOL_DOCUMENT;
        } else if (msg_body === "4") {
          msg = getUscisRelatedDocsList();
          STATE = STATES.DELIVER_USCIS_DOCUMENT;
        } else if (msg_body === "5") {
          msg = getPersonalIdsDocList();
          STATE = STATES.DELIVER_PERSONAL_ID_DOCUMENT;
        } else if (msg_body === "6") {
          msg = getPostReleaseDocsList();
          STATE = STATES.DELIVER_POST_RELEASE_DOCUMENT;
        } else {
          STATE = STATES.GREETING;
        }
        sendMessage(phone_number_id, from, msg);
      } else if(STATE === STATES.DELIVER_INCOME_DOCUMENT) {
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        STATE = STATES.GREETING;
        let msg = "Sorry, we couldn't find that document, please respond with just a number";
        if (msg_body === "1") {

          msg = "";
        }
        sendMessage(phone_number_id, from, msg);
      } else if (STATE === STATES.DELIVER_HEALTH_DOCUMENT) {
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        STATE = STATES.GREETING;
        let msg = "Sorry, we couldn't find that document, please respond with just a number";
        if (msg_body === "1") {
          msg = "getting Hostpital discharge plans";
        } else if (msg_body === "2") {
          msg = "getting Immunization records";
        } else if (msg_body === "3") {
          msg = "getting Health insurance card";
        }
        sendMessage(phone_number_id, from, msg);
      } else if (STATE === STATES.DELIVER_PERSONAL_ID_DOCUMENT) {
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        STATE = STATES.GREETING;
        let msg = "Sorry, we couldn't find that document, please respond with just a number";
        if (msg_body === "1") {
          msg = "License-Front: https://www.dropbox.com/s/olpuhnrkm1blo7e/License-front.jpeg?dl=0\nLicense-Back: https://www.dropbox.com/s/curcnyltmxqkr23/License-back.jpeg?dl=0";
        } else if (msg_body === "2") {
          msg = "getting Consulate ID";
        } else if (msg_body === "3") {
          msg = "getting Copies of passport";
        } else if (msg_body === "4") {
          msg = "getting work permit";
        } else if (msg_body === "5") {
          msg = "getting social security card";
        } else if (msg_body === "6") {
          msg = "getting verification of release form";
        }
        sendMessage(phone_number_id, from, msg);
      } else if (STATE === STATES.DELIVER_SCHOOL_DOCUMENT) {
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        STATE = STATES.GREETING;
        let msg = "Sorry, we couldn't find that document, please respond with just a number";
        if (msg_body === "1") {
          msg = "getting report cards";
        } else if (msg_body === "2") {
          msg = "getting IEP plan";
        } else if (msg_body === "3") {
          msg = "getting non-parrent affidavit";
        }
        sendMessage(phone_number_id, from, msg);
      } else if (STATE === STATES.DELIVER_USCIS_DOCUMENT) {
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        STATE = STATES.GREETING;
        let msg = "Sorry, we couldn't find that document, please respond with just a number";
        if (msg_body === "1") {
          msg = "getting Case status/recepts notices (I-797)";
        } else if (msg_body === "2") {
          msg = "getting OTIP letter";
        }
        sendMessage(phone_number_id, from, msg);
      } else if (STATE === STATES.DELIVER_POST_RELEASE_DOCUMENT) {
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        STATE = STATES.GREETING;
        let msg = "Sorry, we couldn't find that document, please respond with just a number";
        if (msg_body === "1") {
          msg = "getting medical records";
        } else if (msg_body === "2") {
          msg = "getting list of social service providers";
        }
        sendMessage(phone_number_id, from, msg);
      }
      res.sendStatus(200);
      console.log("Sent status 200");
      console.log("Next state: " + STATE);
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  }
});

function getDropboxInstance() {

  let dbx_config = {
    accessToken: DBX_ACCESS_TOKEN,
  };

  let _dbx = new dbx.Dropbox(dbx_config);

  return _dbx;
}

function getDbxObj() {
	let this_dbx = getDropboxInstance();
  const response = this_dbx.list
	const members = response.result.members;
  console.log(members);
}

function sendMessage(phone_number_id, from, message) {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v14.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: { body: message },
    },
    headers: { "Content-Type": "application/json" },
  });
}

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
