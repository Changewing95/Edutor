
const nodemailer = require('nodemailer');


// - Jeremy

// Credential For Edutor Email Account
// Gmail: edutorsg@gmail.com
// Password: hhpjiwrxmbqfxcqq
//  Logging in for this account may get difficult, so brace yourself *.* (2FA)


exports.sendMail = async (email, code) => {
    try {
        let transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'edutorsg@gmail.com',
                pass: 'nghzvubknbkxzxwa',
            }
        });

        const mailOptions = {
            from: 'edutorsg@gmail.com',
            to: email,
            subject: 'Edutor Account Confirmation!',
            text: "Dear User, Thanks for registering with Edutor!",
            html: `<div class="app font-sans min-w-screen min-h-screen bg-grey-lighter py-8 px-4>

            <div class="mail__wrapper max-w-md mx-auto">
          
              <div class="mail__content bg-white p-8 shadow-md">
          
                <div class="content__header text-center tracking-wide border-b">
                  <div class="text-red text-sm font-bold">Edutor</div>
                  <h1 class="text-3xl h-48 flex items-center justify-center">E-mail Confirmation</h1>
                </div>
          
                <div class="content__body py-8 border-b">
                  <p>
                    Hey, <br><br>It looks like you just signed up for an account at Edutor, that’s awesome! Can we ask you for email confirmation? Just click the button bellow.
                  </p>
                  <p class="text-sm">
                    Keep Rockin'!<br> Your Edutor team
                  </p>
                </div>
                <a href= 'http://localhost:5000/auth/validate/${code}' style="background-color: #4CAF50; /* Green */
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;" class="btn btn-danger btn-lg btn-block" role="button"
                aria-pressed="true">Confirm Account</a>
                <div class="content__footer mt-8 text-center text-grey-darker">
                  <h3 class="text-base sm:text-lg mb-4">Thanks for using Edutor!</h3>
                  <p>www.Edutor.sg</p>
                </div>
          
              </div>
          
              <div class="mail__meta text-center text-sm text-grey-darker mt-8">
          
                <div class="meta__social flex justify-center my-4">
                  ${code}`
        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        return error;
    }
}