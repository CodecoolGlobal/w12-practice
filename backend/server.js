const express = require('express')
const path = require('path')
const fs = require('fs')
const fileUpload = require("express-fileupload");

const app = express()
const port = 9000

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`))
})

app.use('/public', express.static(`${__dirname}/../frontend/public`))


app.get('/images', (req, res) => {
  res.sendFile(path.join(`${__dirname}/data/images.json`))
})

app.get('/images/:id', (req, res) => {
  console.log(req.params)
  try {
    const searchId = parseInt(req.params.id)
    console.log(searchId)
    if (isNaN(searchId)) {
      console.log("nan")
      res.status(418).send("NaN")
    } else {
      fs.readFile(`${__dirname}/data/images.json`, (err, data) => {// dirname nélkül azt veszi útvonalnak ahol álltunk amikor indítottuk a backendet
        if (err) {
          console.log(err)
          res.send(err)
        } else {
          let result
          const fileData = JSON.parse(data) // átalakítás nélül egy buffert ad vissza
          console.log(fileData)
          fileData.forEach((element, idx) => {
            if (element.id === searchId) {
              result = element
            }
          })
          if (!result) {
            res.status(404).send("nincs adat ezzel az id-vel")
          } else {
            res.send(result)
          }

        }
      })
    }
  } catch (error) {
    res.send("hiba")
  }
})

app.post("/upload-image", (req, res) => {
  console.log("req", req.body)
  // check for errors
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  //kinyerjük a képet a requestbőől
  const newImage = req.files.image;
  /**The .mv() method takes a single argument, which is the destination path where the file should be moved to. After moving the file, the original file at the temporary path created by the middleware is deleted automatically. */
  newImage.mv(`${__dirname}/../frontend/public/img/${newImage.name}`, err => {
    if (err) {
      console.log(err);
    };
  });
//beolvassuk a json/t
  fs.readFile(`${__dirname}/data/images.json`, (err, data) => {
    //két paraméter, a dataát parsolni kell
    if (err) {
      res.send("reading error")
    } else {
      let imgData = JSON.parse(data);
      // console.log("imgData",imgData)

      // A dátumot kihagyhatjuk
      // const date = new Date();
      // const getUploadDate = `${date.getFullYear()}. ${date.getMonth()}. ${date.getDate()}`;
      const lastId = imgData[imgData.length-1].id + 1
      const newImageData = {
        "id": lastId,
        "url": `/${newImage.name}`,
        "title": req.body.title,
        // "uploadDate": getUploadDate,
        "phName": req.body.phName,
      };
      // manipuláljuk a file eredeti tartalmát
      imgData.push(newImageData);

      //  beírjuk a file-t
      fs.writeFile(`${__dirname}/data/images.json`, JSON.stringify(imgData, null, 4), (error) => {
        if (error) {
          res.send("writing error")
        } else {
          return res.json(newImageData);
        };
      });
    }
  })
});

app.delete("/delete-image/:id", (req, res) => {
  const paramId = req.params.id;
  console.log("paramId",paramId)

  fs.readFile(`${__dirname}/data/images.json`, (err, data) => {
      if(err) {
          console.log(err)
      } else {
        // const dataToDelete = JSON.parse(data).filter(img => {
          //   console.log("img", img)
          //   img.id === paramId
          // })
          
          let dataToDelete = null
          const fileData = JSON.parse(data)
          console.log("data",fileData)
          for (let index = 0; index < fileData.length; index++) {
            const element = fileData[index];
            console.log("element",element)
            console.log("elementid",element.id)

            if(element.id === parseInt(paramId)) {
              dataToDelete = element
            }
          }
          
          console.log("dataToDelete",dataToDelete)
          const pictureUploadPath = `${__dirname}/../frontend/public/img${dataToDelete.url}`;
          console.log("pictureUploadPath",pictureUploadPath)

          if (fs.existsSync(pictureUploadPath)) {
                fs.unlinkSync(pictureUploadPath, (err) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                  }
                });
              }

          const imgData = JSON.parse(data).filter(img => img.id != paramId);

          fs.writeFile(`${__dirname}/data/images.json`, JSON.stringify(imgData, null, 4), (error) => {
              if(error) {
                  console.log(error);
              } else {
                  // res.json(imgData)
                  // return res.send(imgData)

              };
          });
      };
      
  });

return res.status(200).send("done");
});



app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`)
})