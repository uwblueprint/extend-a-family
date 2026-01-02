export type MultiMessageProps = {
  learnerProfilePicture: string;
  learnerName: string;
  messageDate: string;
  messageTime: string;
  messageBody: string;
  moduleLink: string;
  moduleNumber: string;
  moduleName: string;
  modulePage: string;
  respondLink: string;
};

export function buildMultiMessage(
  props: MultiMessageProps
): string {
  return `
<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    font-family: Lexend Deca, Arial, sans-serif;
    font-size: 14px;
    line-height: 140%;
    letter-spacing: 0.32px;
    color: #000;
    background: #f8fafa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 32px;
  "
>
  <tr>
    <td style="padding-bottom: 16px">
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="
          font-family: Lexend Deca, Arial, sans-serif;
          font-size: 14px;
          line-height: 140%;
        "
      >
        <tr>
          <td style="width: 24px; vertical-align: middle">
            <img
              src="${props.learnerProfilePicture}"
              alt="${props.learnerName}"
              style="
                display: block;
                width: 24px;
                height: 24px;
                border-radius: 100%;
              "
            />
          </td>

          <td style="padding-left: 8px; vertical-align: middle">
            <div
              style="
                max-width: 224px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 18px;
                font-weight: 600;
                line-height: 120%;
                letter-spacing: 0.12px;
              "
            >
              ${props.learnerName}
            </div>
          </td>

          <td
            style="
              color: #7a7c7f;
              text-align: right;
              white-space: nowrap;
              vertical-align: middle;
            "
          >
            ${props.messageDate} at ${props.messageTime}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding-bottom: 16px">
      ${props.messageBody}
    </td>
  </tr>

  <tr>
    <td>
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="
          font-family: Lexend Deca, Arial, sans-serif;
          font-size: 14px;
          line-height: 140%;
        "
      >
        <tr>
          <td>
            <a
              href="${props.moduleLink}"
              style="
                color: #4f549e;
                text-decoration: none;
                font-weight: 400;
                text-transform: uppercase;
              "
            >
              MODULE ${props.moduleNumber}: ${props.moduleName} &gt; ${props.modulePage}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="text-align: right; padding-top: 16px">
      <a
        href="${props.respondLink}"
        style="
          display: inline-block;
          background: #4f549e;
          padding: 10px 24px;
          border-radius: 4px;
          text-decoration: none;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 0.7px;
        "
      >
        RESPOND
      </a>
    </td>
  </tr>
</table>
`;
}
