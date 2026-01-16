export type FacilitatorEmailNotificationTemplateProps = {
  EAFLogo: string;
  facilitatorName: string;
  introSentence: string;
  emailSettingsLink: string;
  messageBlock: string;
};

export function buildFacilitatorEmailNotificationTemplate(
  props: FacilitatorEmailNotificationTemplateProps
): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Facilitator Email Notification Template</title>
  </head>

  <body style="margin: 0">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        font-family: Lexend Deca, Arial, sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 140%;
        letter-spacing: 0.32px;
        color: #000;
      "
    >
      <tr>
        <td
          style="
            padding: 16px 32px;
            text-align: center;
            border-bottom: 2px solid #e5e7ff;
            background: #f2f3ff;
          "
        >
          <img
            src="${props.EAFLogo}"
            alt="Extend-A-Family logo"
            style="height: 40px"
          />
        </td>
      </tr>

      <tr>
        <td height="32" style="line-height: 0">&nbsp;</td>
      </tr>

      <tr>
        <td style="padding: 0 32px">
          <p style="margin: 0 0 20px">Hi ${props.facilitatorName},</p>

          <p style="margin: 0 0 32px">
            ${props.introSentence}.
          </p>

          ${props.messageBlock}
        </td>
      </tr>

      <tr>
        <td height="32" style="line-height: 0">&nbsp;</td>
      </tr>

      <tr>
        <td style="padding: 0 32px">
          <p style="margin: 0">
            Happy learning,<br />
            Extend-A-Family Waterloo Region 💙
          </p>
        </td>
      </tr>

      <tr>
        <td height="32" style="line-height: 0">&nbsp;</td>
      </tr>

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

      <tr>
        <td
          style="
            padding: 32px 0;
            text-align: center;
            font-size: 12.5px;
            font-weight: 300;
            line-height: 120%;
            letter-spacing: 0.625px;
          "
        >
          YOU RECEIVED THIS EMAIL BECAUSE OF YOUR NOTIFICATION SETTINGS.<br />
          <a
            href="${props.emailSettingsLink}"
            style="display: inline-block; margin-top: 8px; color: #000"
          >
            CHANGE EMAIL SETTINGS
          </a>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
