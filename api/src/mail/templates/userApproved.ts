export const userApprovedHtml = `
<html>

<head></head>

<body>
    <p>Hi {{ contributor }}</p>
    <br />
    <p>Your request to join the South Side Weekly contributor dashboard as a {{ role }} has been approved. 
        You can login using your email here: {{ loginUrl }}.</p>
    
    <br />

    <p>We can't wait to see the work that you do here at South Side Weekly!</p>

    <br />

    <p>Thank you,</p>
    <p>{{ reviewer }} </p>
</body>

</html>`;