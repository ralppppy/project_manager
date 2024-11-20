const path = require("path");
const { HOST, COMPANY_EMAIL } = require(path.resolve(
  "database",
  "config",
  "environment.js"
));

const SetPassword = ({ first_name, last_name, token, expiresInText }) => {
  return `<!-- Content Section -->
            <tr>
                <td style="padding: 20px;">
                    <h2>Hello ${first_name} ${last_name},</h2>
                    <p>We are delighted to welcome you to our platform. To enhance the security of your account, we kindly request that you create a unique password by clicking the button below:</p>
                    <a href="${HOST}/set-password?tkn=${token}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px; margin-bottom: 10px;">Create Password</a>
                    <p>
                       Please note that for security reasons, this link will expire in <b>${expiresInText}<b/>.
                    </p>
                    <p>
                       If the button above does not work, you can alternatively click the following link to set your password: <a href="${HOST}/set-password?tkn=${token}" style="color: #007bff; text-decoration: none;">Click here to set password</a>
                    </p>
                    <p>
                        If you have any questions or require assistance during this process, please do not hesitate to reach out to our dedicated support team at
                        <a href="mailto:${COMPANY_EMAIL}" style="color: #007bff; text-decoration: none;">${COMPANY_EMAIL}</a>.
                    </p>
                    <p>Thank you for choosing us as your trusted partner.</p>
                </td>
            </tr>
      `;
};

module.exports = SetPassword;
