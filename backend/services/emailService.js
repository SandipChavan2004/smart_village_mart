const nodemailer = require('nodemailer');

// Email configuration
const createEmailTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'your-app-password'
        }
    });
};

/**
 * Send product availability email notification
 * @param {string} customerEmail - Customer's email address
 * @param {string} customerName - Customer's name
 * @param {string} productName - Product name
 * @param {number} productPrice - Product price
 * @param {number} stock - Available stock
 * @param {string} productLink - Link to product page
 */
async function sendProductAvailableEmail(customerEmail, customerName, productName, productPrice, stock, productLink) {
    try {
        const transporter = createEmailTransporter();

        const mailOptions = {
            from: '"Smart Village Mart" <noreply@smartvillagemart.com>',
            to: customerEmail,
            subject: `🎉 ${productName} is Back in Stock!`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .product-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Great News!</h1>
              <p>The product you were waiting for is back in stock</p>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>We're excited to let you know that the product you subscribed to is now available!</p>
              
              <div class="product-box">
                <h2>${productName}</h2>
                <p><strong>Price:</strong> ₹${productPrice}</p>
                <p><strong>Available Stock:</strong> ${stock} units</p>
                <p style="color: #10b981; font-weight: bold;">✓ In Stock Now!</p>
              </div>

              <p>Don't wait too long - stock is limited!</p>
              
              <center>
                <a href="${productLink}" class="button">View Product Now</a>
              </center>

              <p>Thank you for shopping with Smart Village Mart!</p>
              
              <div class="footer">
                <p>This is an automated notification because you subscribed to product availability alerts.</p>
                <p>Smart Village Mart - Supporting Local Businesses</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${customerEmail}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send email to ${customerEmail}:`, error.message);
        return false;
    }
}

module.exports = { sendProductAvailableEmail };
