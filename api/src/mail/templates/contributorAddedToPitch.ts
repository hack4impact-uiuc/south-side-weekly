export const contributorAddedToPitchHtml = `
<html>

<head></head>

<body>
    <p>Hi {{ contributor }}</p>

    <p>{{ staff }} has added you to the "{{ title }}" pitch!</p>
    
    <p>Here are the other current contributors for this story:</p>
    {{ contributorsList }}


    <p>Your primary editor, {{ primaryEditor }}, is cc’ed on this email and will be following up to begin discussing your story.
    </p>
    
    <p>We can't wait to see your story come together!</p>

    <p>Thank you,</p>
    <p>{{ staff }} </p>
</body>

</html>
`;
