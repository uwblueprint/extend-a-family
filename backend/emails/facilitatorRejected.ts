const facilitatorRejectedEmail = (): string => `
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
        border-bottom: 2px solid #E5E7FF;
        background: #F2F3FF;
      ">
        <img src="https://firebasestorage.googleapis.com/v0/b/extendafamily-7613e.appspot.com/o/eaf-logo.png?alt=media&token=9f3f5da0-264e-42a5-85a7-0c1fb120b27c" alt="Extend-A-Family logo" style="height: 40px" />
      </td>
    </tr>

    <!-- SPACER -->
    <tr>
      <td height="32" style="line-height: 0">&nbsp;</td>
    </tr>

    <!-- MAIN CONTENT -->
    <tr>
      <td style="padding: 0 32px">
        <p style="margin: 0 0 20px">Hello,</p>

        <p style="margin: 0 0 20px">
          Unfortunately your account for the Extend-A-Family Waterloo Region Financial Literacy Tool could not be approved at this time. If you think there has been a mistake, please contact the administrators to approve your account.
        </p>
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

export default facilitatorRejectedEmail;
