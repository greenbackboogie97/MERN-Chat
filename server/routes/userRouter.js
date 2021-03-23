const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const {
  uniqueNamesGenerator,
  starWars,
  NumberDictionary,
} = require("unique-names-generator");
const User = require("../models/userModel");
const { Contact } = require("../models/contactModel");
const { Conversation } = require("../models/conversationModel");

const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
const randomName = uniqueNamesGenerator({
  dictionaries: [starWars, numberDictionary],
  separator: "_",
  length: 2,
});

// ---REGISTER---
router.post("/register", async (req, res) => {
  try {
    let { username, password, passwordCheck, displayName } = req.body;

    if (!username || !password || !passwordCheck)
      return res.status(400).json({ msg: "Missing fields." });
    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 characters long." });
    if (password !== passwordCheck)
      return res.status(400).json({
        msg: "Passwords do not match.",
      });

    const existingUser = await User.findOne({ username: username });
    if (existingUser)
      return res.status(400).json({
        msg: "An account with that username already exists.",
      });
    if (!displayName) displayName = randomName;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---LOGIN---
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate
    if (!username || !password)
      return res.status(400).json({ msg: "Missing fields." });

    const user = await User.findOne({ username: username });
    if (!user)
      return res.status(400).json({
        msg: "No account with that username has been registered.",
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---CHECK-TOKEN---
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---CURRENT-USER-RETURN---
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
    username: user.username,
  });
});

// ---ADD-CONTACT---
router.post("/create_contact", async (req, res) => {
  const { usernameValue, nameValue, userID } = req.body.contactData;

  try {
    const curUser = await User.findById(userID);
    if (!curUser) {
      return res.status(400).json({
        msg: "Authorization denied.",
      });
    }

    const user = await User.findOne({ username: usernameValue });
    if (!user) {
      return res.status(400).json({
        msg: "A user with the provided username does not exist.",
      });
    }

    if (usernameValue === curUser.username) {
      return res.status(400).json({
        msg: "You cannot add yourself.",
      });
    }

    const isContact = curUser.contacts.find(
      (contact) => contact.username === usernameValue
    );

    if (isContact) {
      return res.status(400).json({
        msg: "This user is already in your contact list.",
      });
    }

    const isContactName = curUser.contacts.find(
      (contact) => contact.name === nameValue
    );

    if (isContactName) {
      return res.status(400).json({
        msg: "You already have a contact with that name.",
      });
    }

    const newContact = new Contact({
      username: usernameValue,
      name: nameValue,
    });

    await User.findByIdAndUpdate(userID, {
      contacts: [...curUser.contacts, newContact],
    });

    res.json(curUser.contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---CONTACTS---
router.post("/contacts", async (req, res) => {
  const curUserID = req.body.userID;

  try {
    const curUser = await User.findById(curUserID);
    if (!curUser) {
      return res.status(400).json({
        msg: "Authoraization denied.",
      });
    }
    const userContacts = curUser.contacts;
    res.json(userContacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---CREATE-CONVERSATION---
router.post("/create_conversation", async (req, res) => {
  const { selectedContacts, userID } = req.body;

  try {
    const curUser = await User.findById(userID);
    if (!curUser) {
      return res.status(400).json({
        msg: "Authorization denied.",
      });
    }

    const newConversation = new Conversation({
      recipients: [curUser.username, ...selectedContacts],
      messages: [],
    });

    await newConversation.save();

    res.json(newConversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---GET-CONVERSATIONS---
router.post("/conversations", async (req, res) => {
  const curUserID = req.body.userID;

  try {
    const curUser = await User.findById(curUserID);
    if (!curUser) {
      return res.status(400).json({
        msg: "Authoraization denied.",
      });
    }

    const userConversations = await Conversation.find({
      recipients: curUser.username,
    });

    if (!userConversations) {
      return res.json({
        msg: "No conversations found.",
      });
    }

    res.json(userConversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---UPDATE-CONVERSATION---
router.post("/sync_conversation", async (req, res) => {
  const conversationID = req.body.conversationID;

  const sndr = req.body.sender;
  const mesg = req.body.message;
  const tim = req.body.time;

  try {
    const conversationToSync = await Conversation.findById(conversationID);
    if (!conversationToSync)
      return res.json({
        msg: "Mongo could not find the provided conversation.",
      });
    const newMessage = {
      sender: sndr,
      message: mesg,
      time: tim,
      conversationID: conversationID,
    };
    const newMessages = [...conversationToSync.messages, newMessage];
    const updatedConversaiton = await Conversation.findByIdAndUpdate(
      { _id: conversationID },
      { messages: newMessages }
    );

    if (!updatedConversaiton)
      return res.json({ msg: "couldnt update conversation" });

    res.json(updatedConversaiton);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
