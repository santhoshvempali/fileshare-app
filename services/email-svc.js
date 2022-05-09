const nodemailer=require("nodemailer")

async function sendEmail({from,to,subject,text,html}){
    let transporter=nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: 'learningdevelopmentdega@gmail.com',
            pass:"SAI8500sai@#"
        }
    });
    let info=await transporter.sendMail({
        from: `fileshare ${from}`,
        to,
        subject,
        text,
        html
    })
}



module.exports=sendEmail