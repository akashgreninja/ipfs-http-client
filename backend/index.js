const express = require("express");
const app = express();
const firebase = require("firebase-admin");
const { create } = require("ipfs-http-client");
const Users = require("./firebase");
const PORT = 5001;
var cors = require("cors");

app.use(cors());
app.use(express.json());
const {
  getFirestore,
  Timestamp,
  FieldValue,
  DocumentReference,
} = require("firebase-admin/firestore");


// const projectId = '2E8Kps3Xij.................';   //(Step 3. Place the project id from your infura project)
// const projectSecret=


const db = getFirestore();

async function ipfscli(params) {
  const ipfs = await create(
    {     host: "ipfs.infura.io",
    port: 5001,
    protocol: "https"}
  );

  return ipfs;
}

app.post("/add", async (req, res) => {
  const { name, hash, email } = req.body;
  const {adddata} = db.collection("userdata");
  
  try {
    let ipfs =await  ipfscli();
    console.log("1")
    let result = await ipfs.add("wadu");
    console.log("2")
    await adddata.add({
      name: name,
      result: result,
      email: email,
    });
    res.status(200).send({ msg: "sucessfully sent ", thehash: result });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, hash } = req.body;
  try {
    const snapshot = await db
      .collection("users")
      .where("hash", "==", hash)

      .get(1);
    var new_pass;
    var new_id;
    if (!snapshot) {
      success = false;
      return res.status(400).json({ error: "Please try to login again " });
    }
    snapshot.forEach((doc) => {
      new_pass = doc.data().hash;
      new_id = doc.id;
    });
    res.json({ success, authtoken });
  } catch (e) {
    console.log(e.msg);
  }
});

app.listen(PORT, () => {
  console.log("we are onlinee at http://localhost:5000");
});
