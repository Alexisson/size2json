import express from "express";
import multer from "multer";
import sizeOf from "image-size";
import sharp from "sharp";
import fs from "fs";
import axios from "axios";

const app = express();

const img = multer({
  dest: "./img",
});

app
  .set("view engine", "ejs")
  .set("views", "views")
  .get("/", (r) => r.res.render("./index"))
  .post("/size2json", img.single("image"), async (r) => {
    const tempPath = r.file.path;
    sizeOf(tempPath, function (err, dimensions) {
      r.res.send({
        width: dimensions.width,
        height: dimensions.height,
      });
    });
  })
  .get("/makeimage?", (r) => {
    const width = parseInt(r.query.width);
    const height = parseInt(r.query.height);
    sharp("./img/ALX_ICON.png")
      .resize(width, height)
      .toFile("./img/output.png", (err, info) => {
        r.res.download("./img/output.png");
      });
  })
  .all("/wordpress/", (req, res) => {
    axios
      .post(
        "https://wordpress.kodaktor.ru/wp-json/jwt-auth/v1/token?username=gossjsstudent2017&password=|||123|||456"
      )
      .then(function (response) {
        let config = {
          Authorization: `Bearer ${response.data.token}`,
        };
        let data = {
          title: "alexisson",
          status: "publish",
        };
        axios
          .get("https://wordpress.kodaktor.ru/wp-json/wp/v2/posts")
          .then(function (r) {
            axios
              .post(
                `https://wordpress.kodaktor.ru/wp-json/wp/v2/posts/`,
                null,
                {
                  headers: config,
                  params: data,
                }
              )
              .then((response) => {
                res.status(200).json(response.data.id);
              });
          });
      });
  })
  .all("/log", (r) => {
    console.log(r.params.data);
    console.log(r.headers);
  })
  .get("/sha1", (r) => {
    r.res.render("./sha");
  })
  .post("/sha1", (r) => {
    let data = r.body.inp;
    let data_crypto = crypto.subtle.digest("SHA-1", data);
    console.log(data_crypto);
  })
  .all("/login", (r) => r.res.send("alexisson"))
  .listen(process.env.PORT || 3000, () => {
    console.log("Server is working");
  });
