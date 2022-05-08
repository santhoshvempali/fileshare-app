const router=require("express").Router();
const File=require("../models/file")
const res = require("express/lib/response");
const multer=require("multer")
const path=require("path")

const {v4: uuidv4}=require("uuid")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

let upload=multer({
    storage: storage,
    limits: ({fieldSize: Infinity})
}).single("myFile")



    //validate request
router.post('/', (req, res) => {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send({ error: err.message });
          }
          console.log(req.file.filename)
            const file = new File({
                fileName: req.file.filename,
                uuid: uuidv4(),
                path: req.file.path,
                size: req.file.size,
            });
            console.log(file)
            const response = await file.save();
            res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
          });
    });

    router.post('/send', async (req, res) => {
      console.log(req.body)
      const { uuid, emailTo, emailFrom} = req.body;
      if(!uuid || !emailTo || !emailFrom) {
          return res.status(422).send({ error: 'All fields are required except expiry.'});
      }
      // Get data from db 
      try {
        const file = await File.findOne({ uuid: uuid });
        console.log(file)
        // if(file.sender) {
        //   return res.status(422).send({ error: 'Email already sent once.'});
        // }
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();
        // send mail
        const sendMail = require('../services/email-svc');
        sendMail({
          from: emailFrom,
          to: emailTo,
          subject: 'inShare file sharing',
          text: `${emailFrom} shared a file with you.`,
          html: require('../services/emailTemplate')({
                    emailFrom, 
                    downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                    size: parseInt(file.size/1000) + ' KB',
                    expires: '24 hours'
                })
        }).then(() => {
          return res.json({success: true});
        }).catch(err => {
          console.log(err,"email error")
          return res.status(500).json({error: 'Error in email sending.'});
        });
    } catch(err) {
      console.log(err)
      return res.status(500).send({ error: 'Something went wrong.'});
    }
    
    });
    
    module.exports=router