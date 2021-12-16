export const contributorAddedToPitchHtml = `
<html>

<head></head>

<body>
    <p>Hi {{ contributor }}</p>

    <br />

    <p>{{ staff }} has added you to the "{{ title }}" pitch!</p>
    
    <br />

    <p>Here are the other current contributors for this story:</p>
    {{ contributorsList }}
    <br />

    <p>Your primary editor, {{ primaryEditor }}, is cc’ed on this email and will be following up to begin discussing your story.
    </p>

    <br />
    
    <p>We can't wait to see your story come together!</p>

    <br />

    <p>Thank you,</p>
    <p>{{ staff }} </p>
</body>

</html>
`;