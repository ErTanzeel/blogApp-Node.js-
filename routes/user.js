const { Router } = require("express");
const User = require("../models/user");


const multer = require("multer");
const path = require("path");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/images/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });



router.post("/signup", upload.single('profilePic'), async (req, res) => {

  console.log('req.file.filename',req.file.filename);

  const { fullName, email, password } = req.body;
  console.log('fullName', fullName)
  await User.create({
    fullName,
    email,
    password,
    profileImageURL: `/images/${req.file.filename}`,

  });
  return res.redirect("/");
});

module.exports = router;
