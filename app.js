// require("dotenv").config();
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema , reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");



// //requiring router files
// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");




// app.set("view engine", "ejs");
// app.set("views",path.join(__dirname,"views"));
// app.use(express.urlencoded({extended: true}));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));


// //2]connecting to database
// //const MongoDB = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;
// main()
//   .then(()=>{
//     console.log("Connected to DB");
//   })
//   .catch((err)=>{
//     console.log(err);
//   });

// async function main(){
//   await mongoose.connect(dbUrl);
// }

// const store = MongoStore.create({
//   mongoUrl : dbUrl,
//   crypto: {
//     secret: process.env.SECRET,
//   },
//   touchAfter: 24 * 3600,
// });

// store.on("error", () => {
//   console.log("ERROR in mongo session store", err);
// });

// const sessionOptions = {
//   store,
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly : true,
//   }
// };

// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());





// app.use((req,res,next)=>{
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });


// // app.get("/demouser", async (req,res)=>{
// //   let fakeUser = new User({
// //     email: "student@gmail.com",
// //     username: "delta-student"
// //   })
// //   let registeredUser = await User.register(fakeUser,"helloworld");
// //   res.send(registeredUser);
// // });


// app.use("/listing", listingRouter);
// app.use("/listing/:id/reviews", reviewRouter);
// app.use("/" , userRouter);

// // Root route (redirect to listings)
// app.get("/", (req, res) => {
//   res.redirect("/listing");
// });
// app.get("/test", (req, res) => {
//   res.send("Server is running!");
// });



// //if request comes to page which is not listed above 
// // app.all("*",(req,res,next)=>{
// //   next(new ExpressError(404, "Page not Found!"));
// // });

// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).send(message);
// });







// // app.get("/testlisting",async (req,res)=>{
// //   let sampleListing = new Listing({
// //     title: "New Villa",
// //     description: "By the Beach",
// //     price: 1200,
// //     location: "Goa",
// //     country: "India",
// //   });
// //   await sampleListing.save();
// //   console.log("Samplewas saved");
// //   res.send("Successful testing");
// // });

// //1]starting server on 8080
// // app.listen(8080,()=>{
// //   console.log("Server is listening to port 8080");
// // });
// const PORT = process.env.PORT || 8080; // fallback for local development

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is listening on port ${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ====== VIEW ENGINE SETUP ======
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ====== MIDDLEWARE ======
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ====== DATABASE CONNECTION ======
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log("DB Connection Error:", err));

// ====== SESSION STORE ======
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", err => console.log("SESSION STORE ERROR", err));

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ====== PASSPORT SETUP ======
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ====== FLASH & CURRENT USER ======
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ====== ROUTERS ======
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter); // login/signup routes remain at /login and /signup

// ====== ROOT ROUTE ======
app.get("/", (req, res) => {
  res.redirect("/listing");
});

// ====== TEST ROUTE ======
app.get("/test", (req, res) => {
  res.send("Server is running!");
});

// ====== ERROR HANDLER ======
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

// ====== START SERVER ======
const PORT = process.env.PORT || 8080; // Render dynamic port
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});

