import styles from './_styles';

const template = async ({ files }) => {
  const scripts = (files.js || [])
    .map(({ fileName }) => `<script src="./${fileName}" type="module"></script>`)
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=device-width">
    <title>Web Stories</title>
    ${styles}
  </head>
  <body>
    <stories-view></stories-view>
    ${scripts}
  </body>
</html>`;
};

export default template;
