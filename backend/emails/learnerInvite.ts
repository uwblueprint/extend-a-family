import {
  defaultLoginLink,
  defaultLogoHeight,
  defaultLogoURL,
  defaultLogoWidth,
} from "./constants";

const learnerInviteEmail = (
  learnerName: string,
  facilitatorName: string,
  verifyEmailLink: string,
  temporaryPassword: string,
  loginLink: string = defaultLoginLink,
): string => `
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Learner Invitation Email</title>
</head>

<body style="margin: 0">
  <table width="100%" cellpadding="0" cellspacing="0" style="
      font-family: Lexend Deca, Arial, sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 140%;
      letter-spacing: 0.32px;
      color: #000;
    ">
    <!-- TOP BANNER -->
    <tr>
      <td style="
        padding: 16px 32px;
        text-align: center;
        border-bottom: 2px solid #C8F3FA;
        background: #E3F9FC;
      ">
        <img src="${defaultLogoURL}" alt="Extend-A-Family logo" style="width: ${defaultLogoWidth}; height: ${defaultLogoHeight}" />
      </td>
    </tr>

    <!-- SPACER -->
    <tr>
      <td height="32" style="line-height: 0">&nbsp;</td>
    </tr>

    <!-- MAIN CONTENT -->
    <tr>
      <td style="padding: 0 32px">
        <p style="margin: 0 0 20px">Hi ${learnerName},</p>

        <p style="margin: 0 0 20px">
          ${facilitatorName} made your account on the Extend-A-Family Waterloo Region Financial Literacy Tool.
        </p>

        <p style="margin: 0 0 20px">
          Please click <a href="${verifyEmailLink}">here</a> to verify your email. Then, please use the temporary
          password below to <a href="${loginLink}">login</a>.
        </p>

        <div style="
          display: flex;
          padding: 20px;
          margin: 0 0 20px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 8px;
          align-self: stretch;
          border-radius: 8px;
          background: var(--Neutral-Light-Hover, #F8FAFA);
        ">
          <p style="
            width: 100%;
            margin: 0;
            text-align: center;
            color: var(--Neutral-900, #111);
            font-family: Courier New, monospace;
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            line-height: 140%;
            letter-spacing: 0.4px;
          ">${temporaryPassword}</p>
        </div>

        <!-- RESPOND BUTTON -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center">
              <a href="${loginLink}" style="
                display: inline-block;
                background: #006877;
                padding: 10px 24px;
                border-radius: 4px;
                text-decoration: none;
                color: #fff;
                font-weight: 300;
                letter-spacing: 0.7px;
              ">
                LOG IN
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SPACER -->
    <tr>
      <td height="32" style="line-height: 0">&nbsp;</td>
    </tr>

    <!-- SIGNATURE -->
    <tr>
      <td style="padding: 0 32px">
        <p style="margin: 0">
          Happy learning,<br />
          Extend-A-Family Waterloo Region 💙
        </p>
      </td>
    </tr>

    <!-- SPACER -->
    <tr>
      <td height="32" style="line-height: 0">&nbsp;</td>
    </tr>

    <!-- DIVIDER -->
    <tr>
      <td style="padding: 0 32px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-top: 1px solid #d1d2d4; line-height: 1px">
              &nbsp;
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="
        color: var(--Neutral-700, #555759);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 140%;
        letter-spacing: 0.32px;
        padding: 20px;
      ">
        This is an automatic message. If you need help, feel free to reply to this email.
      </td>
    </tr>
  </table>
</body>

</html>
`;

export default learnerInviteEmail;
