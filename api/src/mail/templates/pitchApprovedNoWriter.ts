export const pitchApprovedNoWriterHtml = `
<html>

<head></head>

<body>
    <p>Hi {{ contributor }}</p>
    <br />
    <p>Congratulations, your pitch {{ title }} has been approved! Here are the details you provided regarding the pitch:
    </p>
    <p><b>{{ description }}</b></p>
    <br />
    <p>Your pitch has been added to the <a href="{{ pitchDocLink }}">{{ pitchDocLink }}</a></p>
    <br />

    <p>Thanks for submitting your pitch,</p>
    <p>{{ staff }} </p>
</body>

</html>
`;
