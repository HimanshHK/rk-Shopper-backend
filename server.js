//initialize express, mongoose and body-parser
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port =  process.env.PORT || 8080;
require('dotenv').config();
// const adminRoutes = require("./routes/adminRoutes")
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
// const feedsRoutes = require("./routes/feedsRoutes");
const buyerOrdersRoutes = require("./routes/buyerOrdersRoutes");
const sellerOrdersRoutes = require("./routes/sellerOrdersRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const swaggerDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt=require('jsonwebtoken');


app.use(express.urlencoded({ extended: false }));
app.use(cors())
const swaggerjsdoc   =   YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerjsdoc))

mongoose.connect("mongodb+srv://himanshuhkcoding:1vLvKhgyASoZm4P7@cluster0.fu7lfmb.mongodb.net/ShopDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to database mongodb database");
});


const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));


app.use("/images", (req, res, next) => {
  console.log(req.path);

  next();
}, express.static("images"));


app.get("/image", (req, res) => {
  res.sendFile(__dirname + `/images${req.path}`);
});
//added multer middleware
mongoose.connection.on("error", (err) => {
  if (err) {
    console.log("Error in database connection: " + err);
  }
});



//body - parser
app.use(bodyParser.json());

//static files
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "../shared/uploads")));

// app.use('/', (req, res, next) => {
//   console.log(req.body);
//   next();
// });


app.use('/api',wishlistRoutes);
// app.use('/api',adminRoutes);
app.use('/api',userRoutes);
app.use('/api',sellerOrdersRoutes);
app.use('/api',productRoutes);
// app.use('/api',feedsRoutes);
app.use('/api',buyerOrdersRoutes);


app.listen(port, () => {
  console.log("Server started at port: " + port);
});

