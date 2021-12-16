export const claimReqApprovedHtml = `
<html>

<head></head>

<body>
    <p>Hi {{ contributor }}</p>
    <br />
    <p>Congratulations, your request to join the "{{ title }}" pitch as a Contributor Team Type has been approved!</p>
    
    <br />

    <p>Here are the other current contributors for this story:</p>
    {{ contributorsList }}
    <br />

    <p>If you have any questions or need any additional support, please contact your primary editor, 
       {{ primaryEditor }}, who is cc’ed on this email. We can’t wait to see what you all come up with!</p>


    <p>Thank you,</p>
    <p>{{ staff }} </p>
</body>

</html>
`;