export const pitchDeclinedHtml = `
<html>

<head></head>

<body>
    <p>Hi {{ contributor }}</p>
    <br />
    <p>Thank you for submitting your pitch "{{ title }}". Unfortunately, your pitch was declined for the following
        reason.
    <p>{{ reasoning }}</p>

    </p>
    <p><b>{{ description }}</b></p>
    <br />
    <p>If you have any questions or need any additional support, please contact {{ contact }}. Check out more
        pitch-writing {{ resourcesLink }} under the “Writing” tab. In the meantime, feel free to check the {{ pitchDocLink }} for potential
        new stories to claim!
    </p>
    <br />


    <p>Thank you,</p>
    <p>{{ staff }} </p>
</body>

</html>`;
