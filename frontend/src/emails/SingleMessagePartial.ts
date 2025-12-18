export type SingleMessagePartialProps = {
  messageBody: string;
  moduleLink: string;
  moduleNumber: string;
  moduleName: string;
  modulePage: string;
  messageDate: string;
  messageTime: string;
  respondLink: string;
};

export function buildSingleMessagePartial(
  props: SingleMessagePartialProps
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
    background: #f8fafa;
    border-radius: 8px;
    padding: 20px;
    color: #000;
  "
>
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
          letter-spacing: 0.32px;
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
              "
            >
              MODULE ${props.moduleNumber}: ${props.moduleName} &gt; ${props.modulePage}
            </a>
          </td>

          <td
            style="
              color: #7a7c7f;
              text-align: right;
              white-space: nowrap;
            "
          >
            ${props.messageDate} at ${props.messageTime}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="font-family: Lexend Deca, Arial, sans-serif"
>
  <tr>
    <td height="32" style="line-height: 0">&nbsp;</td>
  </tr>
</table>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="font-family: Lexend Deca, Arial, sans-serif"
>
  <tr>
    <td style="text-align: center">
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
