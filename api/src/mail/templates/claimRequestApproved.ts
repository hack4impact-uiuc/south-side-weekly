export const claimReqApprovedHtml = `
<html>

<head></head>

<body>
    <p>Hi {{ contributor }}</p>

    <p>Congratulations, your request to join the "{{ title }}" pitch on the {{teamName}} team has been approved!</p>
    

    <p>Here are the other current contributors for this story:</p>
    {{{ contributorsList }}}

    <p>If you have any questions or need any additional support, please contact your primary editor, 
       {{ primaryEditor }}, who is cc’ed on this email. We can’t wait to see what you all come up with!</p>


    <p>Thank you,</p>
    <p>{{ staff }} </p>
</body>

</html>
`;
