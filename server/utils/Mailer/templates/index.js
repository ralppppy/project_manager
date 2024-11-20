const template = (content, { primaryColor }) => {
  return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Email Subject</title>
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; color: #333;">
            
                <!-- Email Container -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
                    <tr>
                        <td align="center" valign="top" style="padding: 20px 0;">
                            <!-- Wrapper -->
                            <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                <!-- Header Section -->
                                <tr>
                                    <td align="center" bgcolor="#333" style="padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                        <img src="cid:logo" alt="Company Logo" style="max-width: 200px; display: block;">
                                    </td>
                                </tr>
                                <!-- Content Section -->
                               
                                   ${content}
                        
                                <!-- Footer Section -->
                                <tr>
                                    <td align="center" bgcolor="#333" style="padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                        <p style="color: #fff; margin: 0;">&copy; 2023 Your Company Name | <a href="#" style="color: #fff; text-decoration: none;">Unsubscribe</a></p>
                                        <p style="color: #fff; margin: 5px 0;">Address: 123 Main Street, City, Country</p>
                                        <p style="color: #fff; margin: 5px 0;">Phone: +1 (123) 456-7890</p>
                                        <p style="color: #fff; margin: 5px 0;">Email: info@yourcompany.com</p>
                                    </td>
                                </tr>
                            </table>
                            <!-- End Wrapper -->
                        </td>
                    </tr>
                </table>
                <!-- End Email Container -->
            
            </body>
            </html>
  
    `;
};

module.exports = template;
