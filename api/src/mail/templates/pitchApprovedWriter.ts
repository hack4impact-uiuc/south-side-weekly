export const pitchApprovedWriterHtml = `
<html>

<head></head>

<body>
    <p>Hi {{ contributor }}</p>

    <p>Congratulations, your pitch {{ title }} has been approved! Here are the details you provided regarding the pitch:
    </p>
    <p><b>{{ description }}</b></p>
    <p>Your pitch has been added to the pitch doc (<a href="{{ pitchDocLink }}">{{ pitchDocLink }}</a>). Your primary editor, {{
        primaryEditor }}, is cc’ed on this email
        and will be following up to begin discussing your story.</p>

    <p>We can't wait to see your story come together!</p>

    <p>Thanks for submitting your pitch,</p>
    <p>{{ staff }} </p>
</body>

</html>`;
